import { generateImages } from "pwa-asset-generator";
import { rm } from "fs";
import { promisify } from "util";
import { createServer } from "http";
import { isAfter } from "date-fns";
import serveHandler from "serve-handler";
import Redis from "ioredis";
import {
	command,
	option,
	boolean as booleanArg,
	flag,
	number as numberArg,
	run,
} from "cmd-ts";
import { execSync } from "child_process";

/* #region Utils */
const rmPromise = promisify(rm);

const REDIS_STORAGE_KEY = "iconsLastGeneratedAt";

const getDateFileWasModifiedAt = (filePath: string) => {
	const dateString = execSync(`git log -1 --format=%cd "${filePath}"`)
		.toString()
		.trim();

	return new Date(dateString);
};

/* #endregion */

const app = command({
	name: "generatePwaAssets",
	args: {
		useRedis: flag({
			type: booleanArg,
			long: "redis",
			defaultValue: () => false,
			description: "Connect to redis to read/write the last generated at date",
		}),
		doNotUpdateRedis: flag({
			type: booleanArg,
			long: "no-redis-update",
			defaultValue: () => false,
			description: "Do not update redis with the last generated at date",
		}),
		silent: flag({
			type: booleanArg,
			long: "silent",
			short: "s",
			defaultValue: () => false,
			description: "Disable the logging of the asset generator",
		}),
		force: flag({
			type: booleanArg,
			long: "force",
			short: "f",
			defaultValue: () => false,
			description:
				"Force the generation of new icons, regardless of if the favicon has changed",
		}),
		port: option({
			type: numberArg,
			long: "port",
			short: "p",
			defaultValue: () => 8080,
			description: "The port to run the server on",
		}),
	},
	handler: async ({
		useRedis,
		silent,
		force,
		port: PORT,
		doNotUpdateRedis,
	}) => {
		const shouldUpdateRedis = !doNotUpdateRedis;

		if (!silent) {
			if (useRedis) {
				console.log("Redis will be used to store the last generated at date");
			}
		}

		const redis: Redis | undefined = useRedis
			? new Redis(process.env.REDIS_CONNECTION_STRING ?? "")
			: undefined;

		const redisFetchResult = await redis?.get(REDIS_STORAGE_KEY);

		const iconsLastGeneratedAtISOString =
			redisFetchResult ?? new Date(0).toISOString();

		const faviconWasLastModifiedAt =
			getDateFileWasModifiedAt("public/favicon.svg");
		const iconsWereLastGeneratedAt = new Date(iconsLastGeneratedAtISOString);

		if (!silent) {
			console.log("Right now is:", new Date().toISOString());
			console.log(
				`Favicon was last modified at ${faviconWasLastModifiedAt.toISOString()}`
			);
			console.log(
				`Icons were last generated at ${iconsWereLastGeneratedAt.toISOString()}`
			);
		}

		const needToGenerateNewIcons = isAfter(
			faviconWasLastModifiedAt,
			iconsWereLastGeneratedAt
		);

		if (!needToGenerateNewIcons && !force) {
			console.log("No need to generate new icons");
			process.exit(0);
		}

		if (!needToGenerateNewIcons && force) {
			console.log(
				"Favicon has not been updated since last run, but force flag was passed, proceeding to generate new icons for PWA"
			);
		}

		if (needToGenerateNewIcons) {
			console.log(
				"Favicon has been updated since last run, proceeding to generate new icons for PWA"
			);
		}

		const server = createServer((req, res) => {
			// The asset generator library works by scraping a website, so
			// we spin up a server to just serve the favicon file

			serveHandler(req, res, {
				public: "public",
				rewrites: [
					{
						// Rewrite the root to just serve the favicon
						source: "/",
						destination: "/favicon.svg",
					},
				],
			});
		});

		let thereWasAnError = false;

		try {
			server.listen(PORT);

			await rmPromise("public/icons", { recursive: true, force: true });

			await generateImages(`http://localhost:${PORT}`, "public/icons", {
				manifest: "public/manifest.json",
				iconOnly: true,
				opaque: false,
				pathOverride: "icons",
				log: !silent,
			});

			if (shouldUpdateRedis) {
				await redis?.set(REDIS_STORAGE_KEY, new Date().toISOString());
			}
		} catch (e) {
			thereWasAnError = true;
		} finally {
			server.close();
			process.exit(thereWasAnError ? 1 : 0);
		}
	},
});

run(app, process.argv.slice(2));

import { generateImages } from "pwa-asset-generator";
import { rm, statSync } from "fs";
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

/* #region Utils */
const rmPromise = promisify(rm);

const REDIS_KEY = "iconsLastGeneratedAt";

/* #endregion */

const app = command({
	name: "generatePwaAssets",
	args: {
		noRedis: flag({
			type: booleanArg,
			long: "no-redis",
			defaultValue: () => false,
			description:
				"Do not connect to redis to read or write the last generated at date. This will also force the generation of new icons",
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
	handler: async ({ noRedis, silent, force, port: PORT }) => {
		const redis: Redis | undefined = noRedis
			? undefined
			: new Redis(process.env.REDIS_CONNECTION_STRING ?? "");

		const faviconFileStats = statSync("public/favicon.svg");

		const iconsLastGeneratedAtISOString =
			(await redis?.get(REDIS_KEY)) ?? new Date(0).toISOString();

		const faviconWasLastModifiedAt = new Date(faviconFileStats.mtime);
		const iconsWereLastGeneratedAt = new Date(iconsLastGeneratedAtISOString);

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

			await redis?.set(REDIS_KEY, new Date().toISOString());
		} catch (e) {
			thereWasAnError = true;
		} finally {
			server.close();
			process.exit(thereWasAnError ? 1 : 0);
		}
	},
});

run(app, process.argv.slice(2));

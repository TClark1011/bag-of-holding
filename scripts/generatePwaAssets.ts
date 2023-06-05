import { generateImages } from "pwa-asset-generator";
import { createServer } from "http";
import serveHandler from "serve-handler";
import {
	command,
	option,
	boolean as booleanArg,
	flag,
	number as numberArg,
	run,
} from "cmd-ts";
import { execSync } from "child_process";
import { A, F, pipe } from "@mobily/ts-belt";

/* #region Utils */

const getListOfFilesChangedSinceLastCommit = (): string[] => {
	const stagedFiles = execSync("git diff --cached --name-only")
		.toString()
		.trim()
		.split("\n");
	const nonStagedFiles = execSync("git diff --name-only")
		.toString()
		.trim()
		.split("\n");

	return pipe([...stagedFiles, ...nonStagedFiles], A.uniq, F.toMutable);
};
/* #endregion */

const app = command({
	name: "generatePwaAssets",
	args: {
		silent: flag({
			type: booleanArg,
			long: "silent",
			short: "s",
			defaultValue: () => false,
			description: "Disable the logging of the asset generator",
		}),
		port: option({
			type: numberArg,
			long: "port",
			short: "p",
			defaultValue: () => 8080,
			description: "The port to run the server on",
		}),
		force: flag({
			type: booleanArg,
			long: "force",
			short: "f",
			defaultValue: () => false,
			description:
				"Force the generation of PWA assets, even if the favicon has not changed since the last commit",
		}),
	},
	handler: async ({ silent, port: PORT, force }) => {
		const filesChangedSinceLastCommit = getListOfFilesChangedSinceLastCommit();

		const faviconHasChanged =
			filesChangedSinceLastCommit.includes("public/favicon.svg");

		if (!faviconHasChanged && !force) {
			console.log(
				"Skipping PWA asset generation because the favicon has not changed since the last commit"
			);
			process.exit(0);
		}

		if (force) {
			console.log("Forcing PWA asset generation...");
		} else {
			console.log("Favicon has been changed, Generating PWA assets...");
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

			await generateImages(`http://localhost:${PORT}`, "public/icons", {
				manifest: "public/manifest.json",
				iconOnly: true,
				opaque: false,
				pathOverride: "icons",
				log: !silent,
			});
		} catch (e) {
			thereWasAnError = true;
		} finally {
			server.close();
			process.exit(thereWasAnError ? 1 : 0);
		}
	},
});

run(app, process.argv.slice(2));

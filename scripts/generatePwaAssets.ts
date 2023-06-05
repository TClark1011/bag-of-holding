import { generateImages } from "pwa-asset-generator";
import { rm } from "fs";
import { promisify } from "util";
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

/* #region Utils */
const rmPromise = promisify(rm);

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
	},
	handler: async ({ silent, port: PORT }) => {
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
		} catch (e) {
			thereWasAnError = true;
		} finally {
			server.close();
			process.exit(thereWasAnError ? 1 : 0);
		}
	},
});

run(app, process.argv.slice(2));

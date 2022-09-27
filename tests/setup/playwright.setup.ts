/* eslint-disable jsdoc/require-jsdoc */
import wait from "$tests/utils/wait";
import waitOn from "wait-on";

export default async () => {
	if (process.env.CI) return;

	// await waitOn({
	// 	resources: ["http://localhost:3001"],
	// 	timeout: 1000 * 10,
	// });
	wait(10000);
};

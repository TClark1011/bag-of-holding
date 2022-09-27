/* eslint-disable jsdoc/require-jsdoc */
import wait from "$tests/utils/wait";
import waitOn from "wait-on";

export default async () => {
	await waitOn({
		resources: ["http://localhost:3001"],
	});
	wait(2000);
};

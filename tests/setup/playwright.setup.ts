import wait from "$tests/utils/wait";

export default async () => {
	if (process.env.CI) return;

	wait(10000);
};

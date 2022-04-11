/**
 * Can be used in with `await` to wait for
 * a certain amount of time.
 *
 * @param duration The time to wait in
 * milliseconds.
 */
const wait = (duration: number) => {
	const targetTime = Date.now() + duration;

	let currentDate: number = Date.now();
	do {
		currentDate = Date.now();
	} while (currentDate < targetTime);
};

export default wait;

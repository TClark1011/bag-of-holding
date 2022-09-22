/**
 * Run a function to generate a value, if the function throws,
 * run the second function and return that value
 *
 * @param primary The first function to run to generate the
 * value
 * @param fallback The fallback function that only runs if the
 * primary function throws
 */
const tryCatch = <Output>(primary: () => Output, fallback: () => Output) => {
	try {
		return primary();
	} catch (e) {
		return fallback();
	}
};

export default tryCatch;

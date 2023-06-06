function simpleEquality<T>(a: T, b: T): boolean;
function simpleEquality<T>(a: T): (b: T) => boolean;
function simpleEquality<T>(...args: [T, T] | [T]) {
	if (args.length === 2) {
		const [a, b] = args;

		return a === b;
	}

	const [a] = args;

	return (b: T) => simpleEquality(a, b);
}

export default simpleEquality;

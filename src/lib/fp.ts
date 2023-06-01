import { D } from "@mobily/ts-belt";

export * from "@mobily/ts-belt";

/**
 * Generates a function that will return whatever
 * value it is passed. The actual use of this
 * function is that you can put it first in a
 * call to `flow` and it will type the parameter
 * of the function to be whatever generic you
 * passed to `expect`.
 *
 * @returns A function that takes one parameter
 * and returns that parameter.
 */
export const expectParam = <T>() => (value: T) => value;

/**
 * Create a function that will return the passed
 * value
 *
 * @param value A value that will be returned
 * from the created function
 * @returns A function that will return the
 * passed value
 */
export const give = <T>(value: T) => () => value;

export const get = D.getUnsafe;

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace P {
	/**
	 * FP friendly way of calling a promises `.then` method
	 *
	 * @param promise The promise to call `.then` on
	 * @param onFulfilled The callback to pass to the `.then`
	 * method
	 */
	export function then<Value, Derivation>(
		promise: Promise<Value>,
		onFulfilled: (value: Value) => Derivation
	): Promise<Derivation>;
	/**
	 * FP friendly way of calling a promises `.then` method
	 *
	 * @param onFulfilled The callback to pass to the `.then`
	 * method
	 * @returns a function that accepts the promise to call
	 * `.then` on
	 */
	export function then<Value, Derivation>(
		onFulfilled: (value: Value) => Derivation
	): (promise: Promise<Value>) => Promise<Derivation>;
	/**
	 * FP friendly way of calling a promises `.then` method
	 *
	 * @param params params
	 */
	export function then<Value, Derivation>(
		...params:
			| [Promise<Value>, (p: Value) => Derivation]
			| [(p: Value) => Derivation]
	) {
		const [possiblyPromise, onFulfilled] =
			params.length === 2 ? params : [null, params[0]];

		if (possiblyPromise) {
			return possiblyPromise.then(onFulfilled);
		}

		return (actualPromise: Promise<Value>) => actualPromise.then(onFulfilled);
	}
}

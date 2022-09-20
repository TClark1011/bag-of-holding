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

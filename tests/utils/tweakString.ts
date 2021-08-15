/**
 * Tweak a string by appending "+" to it.
 * Is used when testing state updates to be able to apply
 * consistent updates to string data.
 *
 * @param str The string to tweak
 * @returns `str` with "+" appended to it
 */
const tweakString = (str: string): string => str + "+";

export default tweakString;

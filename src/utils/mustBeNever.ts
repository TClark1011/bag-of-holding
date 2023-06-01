import { F } from "@mobily/ts-belt";

/**
 * Can be used to enforce exhaustiveness checking in switch statements
 * by having the default case call this function, that way this function
 * will raise a type error if the switch statement is not exhaustive.
 */
const mustBeNever = F.identity<never>;

export default mustBeNever;

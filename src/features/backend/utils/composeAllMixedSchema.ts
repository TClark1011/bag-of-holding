import { give, D } from "$fp";
import { SchemaDefinition } from "mongoose";

/**
 * Convert a regular mongoose schema definition
 * into one that has all of its types set to "mixed"
 *
 * @param def The schema definition to convert
 * @returns The converted schema definition
 */
const composeAllMixedSchema = <T>(def: SchemaDefinition<T>) =>
	D.map(def, give({})) as SchemaDefinition<T>;

export default composeAllMixedSchema;

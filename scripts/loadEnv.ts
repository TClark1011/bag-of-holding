/**
 * This file is injected into all scripts that are run with
 * ts-node to load env variables into them. This behaviour
 * is defined in tsconfig in the "ts-node"."require" field.
 */

import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

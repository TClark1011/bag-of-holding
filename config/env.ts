import throwEnv from "throw-env";

export const MONGO_URL = throwEnv("MONGO_URL");

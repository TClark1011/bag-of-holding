import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

process.env.MONGO_URL = "fake mongo url";
//? Have to add a "MONGO_URL" value to "process.env" to stop "throwEnv" throwing an error during testing

afterEach(() => {
	cleanup();
});

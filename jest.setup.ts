import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";

process.env.MONGO_URL = "fake mongo url";
//? Have to add a "MONGO_URL" value to "process.env" to stop "throwEnv" throwing an error during testing

afterEach(() => {
	cleanup();
});
//? Run react testing library's "cleanup" function after every test to prevent flow-on effects from consecutive renders

Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: jest.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: jest.fn(), // Deprecated
		removeListener: jest.fn(), // Deprecated
		addEventListener: jest.fn(),
		removeEventListener: jest.fn(),
		dispatchEvent: jest.fn(),
	})),
});
//? We mock the "matchMedia" window method

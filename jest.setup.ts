import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());
//? Load env variables

afterEach(() => {
	cleanup();
});
//? Run react testing library's "cleanup" function after every test to prevent flow-on effects from consecutive renders

try {
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
} catch (e) {
	console.log("Skipped window property mock because of testing environment");
}

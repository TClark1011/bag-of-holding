import { F } from "@mobily/ts-belt";
import SuperJSON from "superjson";

type SimplifiedSchema<T> = {
	parse: (raw: any) => T;
};

/**
 * Manages a single value in localStorage.
 */
class StorageUnit<T> {
	readonly key: string;
	readonly initialValue: T;
	readonly schema: SimplifiedSchema<T>;

	constructor(key: string, initialValue: T, schema?: SimplifiedSchema<T>) {
		this.schema = schema ?? {
			parse: F.identity,
		};
		this.key = key;
		this.initialValue = this.schema.parse(initialValue); // Just make sure the initial value is val
	}

	setValue(newValue: T): void {
		if (typeof window === "undefined") {
			return;
		}

		const stringifiedNewVal = SuperJSON.stringify(newValue);
		localStorage.setItem(this.key, stringifiedNewVal);

		return;
	}

	resetValue() {
		this.setValue(this.initialValue);
	}

	getValue(): T {
		if (typeof window === "undefined") {
			return this.initialValue;
		}
		const rawRetriedValue = localStorage.getItem(this.key);
		if (!rawRetriedValue) {
			this.resetValue();
			return this.initialValue;
		}

		const deserialized = SuperJSON.parse<T>(rawRetriedValue);

		try {
			return this.schema.parse(deserialized);
		} catch (e) {
			console.warn(
				`Failed to validate value found in localStorage at key "${this.key}", received value: `,
				deserialized
			);

			// If schema throws an error, we want to reset the value
			if (typeof window !== "undefined") {
				this.resetValue();
			}
			return this.initialValue;
		}
	}
}

export default StorageUnit;

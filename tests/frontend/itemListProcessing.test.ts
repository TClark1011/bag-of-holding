/* eslint-disable jsdoc/require-jsdoc */
import {
	renderHook,
	act,
	RenderResult as RenderHookResult,
} from "@testing-library/react-hooks";
import shuffle from "just-shuffle";
import { ChangeEvent } from "react";
import { useSheetPageState } from "$sheets/store";
import {
	InventoryMemberFields,
	FilterableItemProperty,
	ProcessableItemProperty,
	InventoryItemFields,
} from "$sheets/types";
import { alphabet } from "../fixtures/testingConstants";
import { getArrayOfRandomItems } from "../utils/getRandomDataArrays";
import { generateRandomInventoryItem } from "../utils/randomGenerators";

const testSorting = (
	items: InventoryItemFields[],
	members: InventoryMemberFields[],
	column: ProcessableItemProperty
): void => {
	test(column, () => {
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, members);

		act(() => {
			result.current.sortInventory(column, "ascending");
		});
		expect(getProcessed()).toEqual(items);

		act(() => {
			result.current.sortInventory(column, "descending");
		});
		expect(getProcessed()).toEqual(items.reverse());
	});
};

describe("Sorting ", () => {
	const items: InventoryItemFields[] = alphabet.map((letter, index) => ({
		_id: letter,
		quantity: index,
		weight: index,
		value: index,
		carriedBy: index < alphabet.length / 2 ? "1" : "2",
		category: letter,
		description: letter,
		name: letter,
	}));
	const columns = Object.keys(items[0]);
	const members: InventoryMemberFields[] = [
		{
			_id: "1",
			name: "a",
			carryCapacity: 0,
		},
		{
			_id: "2",
			name: "b",
			carryCapacity: 0,
		},
	];

	columns.forEach((column: ProcessableItemProperty) => {
		testSorting([...items], members, column);
	});
});

const getId = (item: InventoryItemFields) => item._id;

describe("Filter", () => {
	const itemAmounts = {
		a: 20,
		b: 26,
		c: 32,
		d: 38,
	};
	const getItemsWithProperty = (
		property:
			| FilterableItemProperty
			| [FilterableItemProperty, FilterableItemProperty],
		value: keyof typeof itemAmounts
	) =>
		[...Array(itemAmounts[value])].map((_, index) => {
			if (typeof property === "string") {
				return generateRandomInventoryItem({
					[property]: value,
					_id: value + index,
				});
			} else {
				return generateRandomInventoryItem({
					[property[0]]: value,
					[property[1]]: value,
					_id: value + index,
				});
			}
		});

	const getItemsWithProperties = (
		property: FilterableItemProperty,
		letters: (keyof typeof itemAmounts)[]
	) =>
		letters.reduce<InventoryItemFields[]>(
			(result, letter) => [
				...result,
				...getItemsWithProperty(property, letter),
			],
			[]
		);

	const items = Object.keys(itemAmounts).reduce<InventoryItemFields[]>(
		(result, letter: keyof typeof itemAmounts) => [
			...result,
			...getItemsWithProperty(["category", "carriedBy"], letter),
		],
		[]
	);

	test("Filter Out Single Category", () => {
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			result.current.updateFilter("category", "a");
		});

		expect(result.current.filters).toEqual({
			category: ["a"],
			carriedBy: [],
		});
		expect(getProcessed().map(getId)).toIncludeSameMembers(
			getItemsWithProperties("category", ["b", "c", "d"]).map(getId)
		);
	});

	test("Filter Out Two Categories", () => {
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			result.current.resetFilters();
			result.current.updateFilter("category", "a");
			result.current.updateFilter("category", "b");
		});

		expect(getProcessed().map(getId)).toIncludeSameMembers(
			getItemsWithProperties("category", ["c", "d"]).map(getId)
		);
	});

	test("Filter Out All But One Category", () => {
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			result.current.resetFilters();
			result.current.updateFilter("category", "a");
			result.current.updateFilter("category", "b");
			result.current.updateFilter("category", "c");
		});

		expect(getProcessed().map(getId)).toIncludeSameMembers(
			getItemsWithProperty("category", "d").map(getId)
		);
	});
	test("Filter Out All Categories", () => {
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			result.current.resetFilters();
			result.current.updateFilter("category", "a");
			result.current.updateFilter("category", "b");
			result.current.updateFilter("category", "c");
			result.current.updateFilter("category", "d");
		});

		expect(getProcessed()).toEqual([]);
	});

	// # Carried by
	test("Filter Out Single Carrier", () => {
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			result.current.resetFilters();
			result.current.updateFilter("carriedBy", "a");
		});

		expect(getProcessed().map(getId)).toIncludeSameMembers(
			getItemsWithProperties("carriedBy", ["b", "c", "d"]).map(getId)
		);
	});

	test("Filter Out Two Carriers", () => {
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			result.current.resetFilters();
			result.current.updateFilter("carriedBy", "a");
			result.current.updateFilter("carriedBy", "b");
		});

		expect(getProcessed().map(getId)).toIncludeSameMembers(
			getItemsWithProperties("carriedBy", ["c", "d"]).map(getId)
		);
	});

	test("Filter Out All But One Carrier", () => {
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			result.current.resetFilters();
			result.current.updateFilter("carriedBy", "a");
			result.current.updateFilter("carriedBy", "b");
			result.current.updateFilter("carriedBy", "c");
			result.current.updateFilter("carriedBy", "d");
		});

		expect(getProcessed()).toEqual([]);
	});

	test("Filter Out All Carriers", () => {
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			result.current.resetFilters();
			result.current.updateFilter("carriedBy", "a");
			result.current.updateFilter("carriedBy", "b");
			result.current.updateFilter("carriedBy", "c");
			result.current.updateFilter("carriedBy", "d");
		});

		expect(getProcessed()).toEqual([]);
	});

	// # reset all filters

	test("Reset Filters", () => {
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			result.current.resetFilters();
			result.current.updateFilter("carriedBy", "a");
			result.current.updateFilter("carriedBy", "b");
			result.current.updateFilter("carriedBy", "c");
			result.current.updateFilter("carriedBy", "d");
			result.current.updateFilter("category", "a");
		});

		expect(getProcessed()).toIncludeAllMembers([]);

		act(() => {
			result.current.resetFilters();
		});

		expect(getProcessed().map(getId)).toIncludeAllMembers(items.map(getId));
	});
});

describe("Searching", () => {
	const search = (
		result: RenderHookResult<ReturnType<typeof useSheetPageState>>,
		searchQuery: string
	) =>
		result.current.searchbarOnChange({
			target: {
				value: searchQuery,
			},
		} as ChangeEvent<HTMLInputElement>);
	test("Basic One Letter Search Returning a Single Item", () => {
		const items = [
			generateRandomInventoryItem({ name: "a" }),
			generateRandomInventoryItem({ name: "b" }),
			generateRandomInventoryItem({ name: "c" }),
			generateRandomInventoryItem({ name: "d" }),
		];
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			search(result, "a");
		});

		expect(getProcessed()).toEqual([items[0]]);
	});

	test("Basic One Letter Search Returning 5 Items", () => {
		const items = [
			...getArrayOfRandomItems(5, { name: "a" }),
			generateRandomInventoryItem({ name: "b" }),
			generateRandomInventoryItem({ name: "c" }),
			generateRandomInventoryItem({ name: "d" }),
		];
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			search(result, "a");
		});

		expect(getProcessed()).toEqual(items.slice(0, 5));
	});

	test("Basic One Letter Search In Large Scrambled Array", () => {
		const amountOfTargetItems = 12;
		const itemsWithA = getArrayOfRandomItems(amountOfTargetItems, {
			name: "a",
		});
		const items = shuffle([
			...itemsWithA,
			...getArrayOfRandomItems(16, { name: "b" }),
			...getArrayOfRandomItems(64, { name: "c" }),
			...getArrayOfRandomItems(128, { name: "d" }),
		]);
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			search(result, "a");
		});

		expect(getProcessed().map(getId)).toIncludeSameMembers(
			itemsWithA.map(getId)
		);
	});

	test("Search Single Item in Large, (All Unique) Array", () => {
		const items = shuffle(getArrayOfRandomItems(400));
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			search(result, items[0].name);
		});

		expect(getProcessed().map(getId)).toEqual(items.slice(0, 1).map(getId));
	});

	test("Reset Search", () => {
		const items = shuffle(getArrayOfRandomItems(400));
		const { result } = renderHook(useSheetPageState);
		const getProcessed = () => result.current.getProcessedItems(items, []);

		act(() => {
			search(result, items[0].name);
		});

		expect(getProcessed().map(getId)).toEqual(
			[...items].slice(0, 1).map(getId)
		);

		act(() => {
			search(result, "");
		});

		expect(getProcessed().map(getId)).toIncludeSameMembers(items.map(getId));
	});
});

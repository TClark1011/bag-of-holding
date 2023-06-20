import {
	disappearingHashAtom,
	useDisappearingHashAtom,
} from "$jotai-hash-disappear-atom";
import { F } from "@mobily/ts-belt";
import { LiteralUnion } from "type-fest";

/**
 * "null" if dialog is closed, "new" if dialog is open to create a new
 * entity, any other string is an ID of an existing entity that the
 * dialog is open to edit.
 */
export type EntityTiedDialogValue = null | LiteralUnion<"new", string>;

export const entityTiedDialogAtom = (entityName: string) =>
	disappearingHashAtom<EntityTiedDialogValue>(
		`${entityName}-dialog`,
		null,
		F.equals(null)
	);

export const useEntityTiedDialogAtom = (
	theAtom: ReturnType<typeof entityTiedDialogAtom>
) => {
	const [value, setValue] = useDisappearingHashAtom(theAtom);

	return {
		isOpen: value !== null,
		isInEditMode: value !== null && value !== "new",
		isInNewMode: value === "new",
		onOpenToEditEntityWithId: (id: string) => setValue(id),
		onOpenToCreateNewEntity: () => setValue("new"),
		onClose: () => setValue(null),
		value,
	};
};

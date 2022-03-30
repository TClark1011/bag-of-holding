import { IdentifiedObject } from "$root/types";

interface InventoryMemberFields extends IdentifiedObject {
	name: string;
	carryCapacity: number;
}

export default InventoryMemberFields;

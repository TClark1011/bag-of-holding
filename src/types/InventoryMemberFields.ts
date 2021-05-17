import { IdentifiedObject } from "./UtilityTypes";

interface InventoryMemberFields extends IdentifiedObject {
	name: string;
	carryCapacity: number;
}

export default InventoryMemberFields;

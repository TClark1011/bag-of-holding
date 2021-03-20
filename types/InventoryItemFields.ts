interface InventoryItemFields {
	_id: string;
	name: string;
	quantity: number;
	type?: string;
	description?: string;
	carriedBy?: string;
	weight?: number;
	value?: number;
}

export default InventoryItemFields;

import InventoryItemFields, {
	InventoryItemCreationFields,
} from "../types/InventoryItemFields";
import Big from "big.js";

/**
 * Multiplies an item's weight by its quantity using big.js
 * Returns the resulting number
 *
 * @param {InventoryItemFields} InventoryItemFields The fields for an inventory item
 * @returns {Number} total item weight
 */
 export const getItemTotalWeight = (currentItem:InventoryItemFields):number => {
  const calcWeight = new Big(currentItem.weight);
	return  parseFloat(calcWeight.times(currentItem.quantity));
};

/**
* Multiplies an item's value by its quantity using big.js
* Returns the resulting number
 *
* @param {InventoryItemFields} InventoryItemFields The fields for an inventory item
 * @returns {Number} total item value
 */
export const getItemTotalValue = (currentItem:InventoryItemFields):number => {
  const calcValue = new Big(currentItem.value);
	return  parseFloat(calcValue.times(currentItem.quantity));
};

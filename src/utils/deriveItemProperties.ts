const Big = require('big.js');

/**
 * Multiplies an item's weight by its quantity using big.js
 * Returns the resulting number
 *
 * @param {InventoryItemFields} InventoryItemFields The fields for an inventory item
 * @returns {Number} total item weight
 */
export const getItemTotalWeight = (currentItem) => {
  let calcWeight = new Big(currentItem.weight);
	return  parseFloat(calcWeight.times(currentItem.quantity));
};

/**
* Multiplies an item's value by its quantity using big.js
* Returns the resulting number
 *
* @param {InventoryItemFields} InventoryItemFields The fields for an inventory item
 * @returns {Number} total item value
 */
export const getItemTotalValue = (currentItem) => {
  let calcValue = new Big(currentItem.value);
	return  parseFloat(calcValue.times(currentItem.quantity));
};

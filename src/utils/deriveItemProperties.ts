const Big = require('big.js');

/**
 * Generate a new inventory item object
 * Takes all the required files, excluding "_id"
 * Creates new object with randomly generated "_id" along with the provided fields
 *
 * @param {InventoryItemFields} InventoryItemFields The fields for an inventory item
 * @returns {number} total item weight
 */
export const getItemTotalWeight = (currentItem) => {
  let calcWeight = new Big(currentItem.weight);
	return  parseFloat(calcWeight.times(currentItem.quantity));
};

/**
 * Generate a new inventory item object
 * Takes all the required files, excluding "_id"
 * Creates new object with randomly generated "_id" along with the provided fields
 *
* @param {InventoryItemFields} InventoryItemFields The fields for an inventory item
 * @returns {value} total item value
 */
export const getItemTotalValue = (currentItem) => {
  let calcValue = new Big(currentItem.weight);
	return  parseFloat(calcValue.times(currentItem.quantity));
};

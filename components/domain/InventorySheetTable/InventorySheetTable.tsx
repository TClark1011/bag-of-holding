import { useColorModeValue } from "@chakra-ui/system";
import {
	Table,
	TableCellProps,
	TableProps,
	Tbody,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/table";
import { useReducer, useState } from "react";
import InventoryItemFields from "../../../types/InventoryItemFields";
import sort, { ISortByFunction } from "fast-sort";
import { ArrowDownIcon, ArrowUpIcon } from "chakra-ui-ionicons";
import TableCell from "../../ui/TableCell";
import inventorySheetTableReducer from "./InventorySheetTable.reducer";

const col4Display = ["none", "table-cell"];
const col5Display = ["none", "none", "table-cell"];
const col6Display = ["none", "none", "none", "table-cell"];

export interface InventorySheetTableProps extends TableProps {
	onRowClick: (item?: InventoryItemFields) => void;
	items: InventoryItemFields[];
}

/**
 * Table that shows items in a sheet inventory
 *
 * @param {object} props Component props
 * @param {InventoryItemFields[]} props.items The items in the inventory
 * @param {Function} props.onRowClick Callback to execute when an item row is clicked.
 * The item's fields are passed as a parameter
 * @returns {React.ReactElement} The rendered html components
 */
const InventorySheetTable: React.FC<InventorySheetTableProps> = ({
	onRowClick,
	items,
	...props
}) => {
	const [{ sorting }, dispatch] = useReducer(inventorySheetTableReducer, {
		sorting: {
			property: "name",
			direction: "ascending",
		},
	});

	const hoverBg = useColorModeValue("gray.100", "gray.700");

	/**
	 * Fetch the sort status of a sorting property
	 *
	 * @param {keyof InventoryItemFields} property The property
	 * to check the sorting status of
	 * @returns {string} "none" if the property is not being sorted by.
	 * Otherwise returns "asc" or "desc" depending on the direction the
	 * property is being sorted .
	 */
	const getPropertySortingStatus = (property: keyof InventoryItemFields) =>
		sorting.property === property ? sorting.direction : "none";

	/**
	 * Fetch the items with all active filters/sorting applied
	 *
	 * @returns {InventoryItemFields[]} The list of items
	 */
	const getProcessedItems = () => {
		const sortFn =
			sorting.direction === "ascending" ? sort(items).asc : sort(items).desc;

		return sortFn([
			(item) =>
				sorting.property === "quantity" || sorting.property === "weight"
					? (item[sorting.property] as number) * item.quantity
					: item[sorting.property],
			(item) => item.name,
		]);
	};

	/**
	 * A component to be used as the column headers
	 *
	 * @param {object} props The props
	 * @param {keyof InventoryItemFields} props.property The property that
	 * the column represents
	 * @param {React.ReactElement} props.children The children
	 * @returns {React.ReactElement} The rendered stuff
	 */
	const TableHeader: React.FC<
		TableCellProps & { property: keyof InventoryItemFields }
	> = ({ property, children, ...props }) => (
		<TableCell
			{...props}
			as={Th}
			// onClick={() => updateSortingBy(property)}
			onClick={() => dispatch({ type: "table_sort", data: property })}
			_hover={{ backgroundColor: hoverBg }}
			cursor="pointer"
		>
			{children}{" "}
			{getPropertySortingStatus(property) ===
			"none" ? null : getPropertySortingStatus(property) === "ascending" ? (
				<ArrowUpIcon />
			) : (
				<ArrowDownIcon />
			)}
		</TableCell>
	);

	return (
		<Table
			colorScheme="gray"
			{...props}
			borderTopWidth={1}
			borderTopColor={hoverBg}
		>
			<Thead>
				<Tr>
					<TableHeader property="name" textAlign="left">
						Name
					</TableHeader>
					<TableHeader property="quantity">Quantity</TableHeader>
					<TableHeader property="weight">Weight</TableHeader>
					<TableHeader property="value" display={col4Display}>
						Value
					</TableHeader>
					<TableHeader property="carriedBy" display={col5Display}>
						Carried By
					</TableHeader>
					<TableHeader property="category" display={col6Display}>
						Category
					</TableHeader>
				</Tr>
			</Thead>
			<Tbody>
				{getProcessedItems().map((item) => (
					<Tr
						key={item._id}
						onClick={() => onRowClick(item)}
						cursor="pointer"
						_hover={{ backgroundColor: hoverBg }}
					>
						<TableCell textAlign="left">{item.name}</TableCell>
						<TableCell>{item.quantity}</TableCell>
						<TableCell>{item.weight * item.quantity}</TableCell>
						<TableCell display={col4Display}>{item.value}</TableCell>
						<TableCell display={col5Display}>
							{item.carriedBy || "Nobody"}
						</TableCell>
						<TableCell display={col6Display}>
							{item.category || "None"}
						</TableCell>
					</Tr>
				))}
				<Tr>
					{/* Bottom Row */}
					<TableCell colSpan={2} fontWeight="bold" textAlign="right">
						Total
					</TableCell>
					<TableCell>
						{items.reduce<number>(
							(accumulator, item) => accumulator + item.weight * item.quantity,
							0
						)}
					</TableCell>
					<TableCell display={col4Display}>
						{items.reduce<number>(
							(accumulator, item) => accumulator + item.value * item.quantity,
							0
						)}
					</TableCell>
					<TableCell display={col5Display} />
					<TableCell display={col6Display} />
				</Tr>
			</Tbody>
		</Table>
	);
};

export default InventorySheetTable;

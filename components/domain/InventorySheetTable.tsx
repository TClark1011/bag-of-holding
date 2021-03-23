import { useColorModeValue } from "@chakra-ui/system";
import {
	Table,
	TableCellProps,
	TableProps,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from "@chakra-ui/table";
import compareFunc from "compare-func";
import { useState } from "react";
import InventoryItemFields from "../../types/InventoryItemFields";
import { useSheetState } from "../contexts/SheetStateContext";
import sort from "fast-sort";
import { ArrowDownIcon, ArrowUpIcon } from "chakra-ui-ionicons";
import TableCell from "../ui/TableCell";

// const numericTableCellProps = {
// 	paddingX: 2,
// 	sx: { textAlign: "center" },
// };

const col4Props = {
	display: ["none", "table-cell"],
};

const col5Props = {
	display: ["none", "none", "table-cell"],
};
const col6Props = {
	display: ["none", "none", "none", "table-cell"],
};

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
	const hoverBg = useColorModeValue("gray.100", "gray.700");

	/**
	 * @typedef {object} SortState The state of the table's sorting
	 * @property {boolean} ascending If the sort mode is currently ascending. If
	 * false then sort mode must be descending
	 * @property {keyof InventoryItemFields} property the Property that is currently being sorted by
	 */
	interface SortState {
		ascending: boolean;
		property: keyof InventoryItemFields;
	}

	/**
	 * The state of the table's sorting
	 */
	const [sortingBy, setSortingBy] = useState<SortState>({
		ascending: true,
		property: "name",
	});

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
		sortingBy.property === property
			? sortingBy.ascending
				? "asc"
				: "desc"
			: "none";

	/**
	 * Fetch the items with all active filters/sorting applied
	 *
	 * @returns {InventoryItemFields[]} The list of items
	 */
	const getProcessedItems = () => {
		const sortFn = sortingBy.ascending ? sort(items).asc : sort(items).desc;
		return sortFn((item) =>
			sortingBy.property === "name" || sortingBy.property === "weight"
				? (item[sortingBy.property] as number) * item.quantity
				: item[sortingBy.property]
		);
	};

	/**
	 * Update the 'sortingBy' status
	 *
	 * @param {keyof InventoryItemFields} property The property that
	 * should now be sorted by. If that property is already being sorted
	 * by, toggle the sorting direction. Otherwise, set the sorting
	 * property to the passed property and sets the sorting direction to
	 * ascending.
	 */
	const updateSortingBy = (property: keyof InventoryItemFields) => {
		const ascending =
			property === sortingBy.property ? !sortingBy.ascending : true;
		//? True if the property was not already being sorted by. Inverse of current direction if it was
		setSortingBy({ ascending, property });
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
			onClick={() => updateSortingBy(property)}
			_hover={{ backgroundColor: hoverBg }}
			cursor="pointer"
		>
			{children}{" "}
			{getPropertySortingStatus(property) ===
			"none" ? null : getPropertySortingStatus(property) === "asc" ? (
				<ArrowUpIcon />
			) : (
				<ArrowDownIcon />
			)}
		</TableCell>
	);
	return (
		<Table colorScheme="gray" {...props}>
			<Thead>
				<Tr>
					<TableHeader property="name" textAlign="left">
						Name
					</TableHeader>
					<TableHeader property="quantity">Quantity</TableHeader>
					<TableHeader property="weight">Weight</TableHeader>
					<TableHeader property="value" {...col4Props}>
						Value
					</TableHeader>
					<TableHeader property="carriedBy" {...col5Props}>
						Carried By
					</TableHeader>
					<TableHeader property="category" {...col6Props}>
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
						<TableCell {...col4Props}>{item.value}</TableCell>
						<TableCell {...col5Props}>{item.carriedBy || "Nobody"}</TableCell>
						<TableCell {...col6Props}>{item.category || "None"}</TableCell>
					</Tr>
				))}
				<Tr>
					{/* Bottom Row */}
					<Td colSpan={2} fontWeight="bold" textAlign="right">
						Total
					</Td>
					<Td>
						{items.reduce<number>(
							(accumulator, item) => accumulator + item.weight * item.quantity,
							0
						)}
					</Td>
					<Td {...col4Props}>
						{items.reduce<number>(
							(accumulator, item) => accumulator + item.value * item.quantity,
							0
						)}
					</Td>
					<Td {...col5Props} />
					<Td {...col6Props} />
				</Tr>
			</Tbody>
		</Table>
	);
};

export default InventorySheetTable;

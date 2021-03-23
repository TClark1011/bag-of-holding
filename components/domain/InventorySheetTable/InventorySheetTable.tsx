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
import { useState } from "react";
import InventoryItemFields from "../../../types/InventoryItemFields";
import sort from "fast-sort";
import { ArrowDownIcon, ArrowUpIcon } from "chakra-ui-ionicons";
import TableCell from "../../ui/TableCell";

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

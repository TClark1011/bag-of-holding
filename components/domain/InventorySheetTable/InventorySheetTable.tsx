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
import InventoryItemFields, {
	ProcessableItemProperty,
} from "../../../types/InventoryItemFields";
import sort, { ISortByFunction } from "fast-sort";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	FilterOutlineIcon,
} from "chakra-ui-ionicons";
import TableCell from "../../ui/TableCell";
import inventorySheetTableReducer, {
	selectFilterUiIsOpen,
	selectProcessedItems,
} from "./InventorySheetTable.reducer";
import { IconButton } from "@chakra-ui/button";
import TableFilter from "../TableFilter";

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
	//? Color to use for background of row items that are hovered

	const [state, dispatch] = useReducer(inventorySheetTableReducer, {
		sorting: {
			property: "name",
			direction: "ascending",
		},
		filters: {
			name: [],
			carriedBy: [],
			category: [],
			description: [],
			weight: [],
			quantity: [],
			reference: [],
			value: [],
		},
		ui: {
			openFilter: false,
		},
	});

	const { sorting, filters } = state;
	//? Destructure after initializer so that full state object can be easily passed to selectors

	const processedItems = selectProcessedItems(state, items);

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
		TableCellProps & { property: ProcessableItemProperty }
	> = ({ property, children, ...props }) => (
		<TableCell
			{...props}
			as={Th}
			onClick={() => dispatch({ type: "table_sort", data: property })}
			_hover={{ backgroundColor: hoverBg }}
			cursor="pointer"
		>
			{children}{" "}
			{sorting.property === property &&
				(sorting.direction === "ascending" ? (
					<ArrowUpIcon />
				) : (
					<ArrowDownIcon />
				))}
			<TableFilter
				isOpen={selectFilterUiIsOpen(state, property)}
				onClose={() => dispatch({ type: "ui_closeFilter" })}
				property={property}
				items={items}
				filter={filters[property]}
			>
				<IconButton
					aria-label="filter"
					icon={<FilterOutlineIcon />}
					onClick={() => dispatch({ type: "ui_openFilter", data: property })}
				/>
			</TableFilter>
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
				{processedItems.map((item) => (
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

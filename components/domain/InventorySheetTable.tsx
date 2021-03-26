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
import { useReducer } from "react";
import InventoryItemFields, {
	ProcessableItemProperty,
} from "../../types/InventoryItemFields";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	FilterOutlineIcon,
} from "chakra-ui-ionicons";
import TableCell from "../ui/TableCell";
import inventorySheetTableReducer, {
	selectFilterUiIsOpen,
	selectProcessedItems,
} from "../../reducers/inventorySheetTableReducer";
import { Button, IconButton } from "@chakra-ui/button";
import TableFilter from "./TableFilter";
import { Text } from "@chakra-ui/layout";
import { InventoryFilters } from "../../reducers/sheetPageReducer";

const col4Display = ["none", "table-cell"];
const col5Display = ["none", "none", "table-cell"];
const col6Display = ["none", "none", "none", "table-cell"];

export interface InventorySheetTableProps extends TableProps {
	onRowClick: (item?: InventoryItemFields) => void;
	items: InventoryItemFields[];
	filters: InventoryFilters;
	onFilterChange: (property: ProcessableItemProperty, item: string) => void;
	search: string;
}

/**
 * Table that shows items in a sheet inventory
 *
 * @param {object} props Component props
 * @param {InventoryItemFields[]} props.items The items in the inventory
 * @param {Function} props.onRowClick Callback to execute when an item row is clicked.
 * The item's fields are passed as a parameter
 * @param {InventoryFilters} props.filters The currently active filters
 * @param {Function} props.onFilterChange Callback to execute when a filter is edited
 * @param {string} props.search The active search query
 * @returns {React.ReactElement} The rendered html components
 */
const InventorySheetTable: React.FC<InventorySheetTableProps> = ({
	onRowClick,
	items,
	filters,
	onFilterChange,
	search,
	...props
}) => {
	const hoverBg = useColorModeValue("gray.100", "gray.700");
	//? Color to use for background of row items that are hovered

	const [state, dispatch] = useReducer(inventorySheetTableReducer, {
		sorting: {
			property: "name",
			direction: "ascending",
		},
		ui: {
			openFilter: false,
		},
	});
	const { sorting } = state;
	//? Destructure after initializer so that full state object can be easily passed to selectors

	const processedItems = selectProcessedItems(state, {
		items,
		filters,
		search,
	});

	/**
	 * A component to be used as the column headers
	 *
	 * @param {object} props The props
	 * @param {ProcessableItemProperty} props.property The property that
	 * the column represents
	 * @param {boolean} [props.allowFilter] Whether or not to show a button
	 * to open the filter interface for the column. If not specified, defaults
	 * to not showing the filter button.
	 * @param {React.ReactElement} props.children The children
	 * @returns {React.ReactElement} The rendered stuff
	 */
	const TableHeader: React.FC<
		TableCellProps & {
			property: ProcessableItemProperty;
			allowFilter?: boolean;
		}
	> = ({ property, children, allowFilter, ...props }) => (
		<TableCell {...props} as={Th}>
			<Button
				variant="ghost"
				onClick={() => dispatch({ type: "table_sort", data: property })}
			>
				<Text marginRight="group">{children}</Text>
				{sorting.property === property &&
					(sorting.direction === "ascending" ? (
						<ArrowUpIcon />
					) : (
						<ArrowDownIcon />
					))}
			</Button>
			{allowFilter && (
				<TableFilter
					isOpen={selectFilterUiIsOpen(state, property)}
					onClose={() => dispatch({ type: "ui_closeFilter" })}
					property={property}
					items={items}
					filter={filters[property]}
					onChange={(value: string) => onFilterChange(property, value)}
				>
					<IconButton
						aria-label="filter"
						icon={<FilterOutlineIcon />}
						onClick={() => dispatch({ type: "ui_openFilter", data: property })}
						variant="ghost"
						isRound
						marginLeft="group"
					/>
				</TableFilter>
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
					<TableHeader property="carriedBy" allowFilter display={col5Display}>
						Carried By
					</TableHeader>
					<TableHeader property="category" allowFilter display={col6Display}>
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

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
import InventoryItemFields, {
	ProcessableItemProperty,
} from "../../../types/InventoryItemFields";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	BookOutlineIcon,
	FilterOutlineIcon,
} from "chakra-ui-ionicons";
import TableCell from "../../ui/TableCell";
import { Button, IconButton } from "@chakra-ui/button";
import TableFilter from "./TableFilter";
import { Link, Text } from "@chakra-ui/layout";
import { useSheetPageState } from "../../../state/sheetPageState";
import { useInventoryState } from "../../contexts/InventoryStateContext";
import { Tooltip } from "@chakra-ui/tooltip";
import isUrl from "is-url-superb";
import { testIdGeneratorFactory } from "../../../utils/testUtils";
import { getItemTotalWeight, getItemTotalValue } from "../../../utils/deriveItemProperties";

const getTestId = testIdGeneratorFactory("InventoryTable");

export const inventoryTableTestIds = {
	nameColumnHeader: getTestId("NameColumnHeader"),
	weightColumnHeader: getTestId("WeightColumnHeader"),
	valueColumnHeader: getTestId("ValueColumnHeader"),
	quantityColumnHeader: getTestId("QuantityColumnHeader"),
	carriedByColumnHeader: getTestId("CarriedByColumnHeader"),
	categoryColumnHeader: getTestId("CategoryColumnHeader"),
};

const col4Display = ["none", "table-cell"];
const col5Display = ["none", "none", "table-cell"];
const col6Display = ["none", "none", "none", "table-cell"];

export interface InventorySheetTableProps extends TableProps {
	onRowClick: (item?: InventoryItemFields) => void;
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
	...props
}) => {
	const hoverBg = useColorModeValue("gray.100", "gray.700");
	//? Color to use for background of row items that are hovered

	//? Destructure after initializer so that full state object can be easily passed to selectors

	const {
		getProcessedItems,
		sorting,
		sortInventory,
		closeFilterPopover,
		openFilterPopover,
		isFilterPopoverOpen,
		getColumnSums,
	} = useSheetPageState();

	const { items } = useInventoryState();
	const processedItems = getProcessedItems(items);
	const columnSums = getColumnSums(items);

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
		}
	> = ({ property, children, ...props }) => (
		<TableCell {...props} as={Th}>
			<Button variant="ghost" onClick={() => sortInventory(property)}>
				<Text marginRight="group">{children}</Text>
				{sorting.property === property &&
					(sorting.direction === "ascending" ? (
						<ArrowUpIcon />
					) : (
						<ArrowDownIcon />
					))}
			</Button>
			{(property === "carriedBy" || property === "category") && (
				<TableFilter
					isOpen={isFilterPopoverOpen(property)}
					onClose={closeFilterPopover}
					property={property}
				>
					<IconButton
						aria-label="filter"
						icon={<FilterOutlineIcon />}
						onClick={() => openFilterPopover(property)}
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
					<TableHeader
						property="name"
						textAlign="left"
						data-testid={inventoryTableTestIds.nameColumnHeader}
					>
						Name
					</TableHeader>
					<TableHeader
						property="quantity"
						data-testid={inventoryTableTestIds.quantityColumnHeader}
					>
						Quantity
					</TableHeader>
					<TableHeader
						property="weight"
						data-testid={inventoryTableTestIds.weightColumnHeader}
					>
						<Tooltip
							label="The weight shown is the total weight of all the instances of an item."
							placement="top"
							openDelay={500}
							hasArrow
						>
							Weight
						</Tooltip>
					</TableHeader>
					<TableHeader
						property="value"
						display={col4Display}
						data-testid={inventoryTableTestIds.valueColumnHeader}
					>
						<Tooltip
							label="The value shown is the total value of all the instances of an item."
							placement="top"
							openDelay={500}
							hasArrow
						>
							Value
						</Tooltip>
					</TableHeader>
					<TableHeader
						property="carriedBy"
						display={col5Display}
						data-testid={inventoryTableTestIds.carriedByColumnHeader}
					>
						Carried By
					</TableHeader>
					<TableHeader
						property="category"
						display={col6Display}
						data-testid={inventoryTableTestIds.categoryColumnHeader}
					>
						Category
					</TableHeader>
				</Tr>
			</Thead>
			<Tbody>
				{processedItems.map((item, index) => (
					<Tr
						key={index}
						onClick={() => onRowClick(item)}
						cursor="pointer"
						_hover={{ backgroundColor: hoverBg }}
					>
						<TableCell textAlign="left">
							{item.reference && isUrl(item.reference) ? (
								<Link
									href={item.reference}
									isExternal
									onClick={(e) => e.stopPropagation()}
								>
									{item.name} <BookOutlineIcon marginLeft={1} />
								</Link>
							) : (
								item.name
							)}
						</TableCell>
						<TableCell>{item.quantity}</TableCell>
						<TableCell>{getItemTotalWeight(item)}</TableCell>
						<TableCell display={col4Display}>
							{getItemTotalValue(item)}
						</TableCell>
						<TableCell display={col5Display}>{item.carriedBy}</TableCell>
						<TableCell display={col6Display}>{item.category}</TableCell>
					</Tr>
				))}
				<Tr>
					{/* Bottom Row */}
					<TableCell colSpan={2} fontWeight="bold" textAlign="right">
						Total
					</TableCell>
					<TableCell>
						{/* Sum of item Weights */}
						{columnSums.weight}
					</TableCell>
					<TableCell display={col4Display}>
						{/* Sum of item values */}
						{columnSums.value}
					</TableCell>
					<TableCell display={col5Display} />
					<TableCell display={col6Display} />
				</Tr>
			</Tbody>
		</Table>
	);
};

export default InventorySheetTable;

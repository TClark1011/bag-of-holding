import {
	Table,
	TableCellProps,
	TableProps,
	Tbody,
	Th,
	Thead,
	Tr,
	Button,
	IconButton,
	Link,
	Text,
	Tooltip,
	useColorModeValue,
} from "@chakra-ui/react";
import { BookOutlineIcon, FilterOutlineIcon } from "chakra-ui-ionicons";
import { getItemTotalValue, getItemTotalWeight } from "$sheets/utils";
import { testIdGeneratorFactory } from "$tests/utils/testUtils";
import { ProcessableItemProperty } from "$sheets/types";
import {
	selectOverallColumnSums,
	selectPropertyFilterMenuIsOpen,
	selectVisibleItems,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import {
	NumericAscendingSortIcon,
	NumericDescendingSortIcon,
	TextAscendingSortIcon,
	TextDescendingSortIcon,
	TableCell,
} from "$root/components";
import { TableFilter, PartyMemberData } from "$sheets/components";
import { SortingDirection } from "$root/types";
import { Item } from "@prisma/client";
import { isUrl } from "$root/utils";
import { matchesSchema } from "$zod-helpers";
import {
	filterableItemPropertySchema,
	sortableItemPropertySchema,
} from "$extra-schemas";

const getTestId = testIdGeneratorFactory("InventoryTable");

export const inventoryTableTestIds = {
	tableRoot: getTestId("TableRoot"),
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
	onRowClick: (item?: Item) => void;
}

const numericProperties: ProcessableItemProperty[] = [
	"quantity",
	"weight",
	"value",
];

/**
 * A set of icons used for sorting. Provides icons for
 * when sorting is ascending and descending.
 */
type SortingIconSet = Record<SortingDirection, JSX.Element>;
const numericSortingIconSet: SortingIconSet = {
	ascending: <NumericAscendingSortIcon />,
	descending: <NumericDescendingSortIcon />,
};
const defaultSortingIconSet: SortingIconSet = {
	ascending: <TextAscendingSortIcon />,
	descending: <TextDescendingSortIcon />,
};

/**
 * Determine which set of sorting icons to use based
 * on the property being sorted.
 *
 * @param property The property being sorted
 * @returns The icon set to use for the property
 */
const determineIconSet = (property: ProcessableItemProperty) =>
	numericProperties.includes(property)
		? numericSortingIconSet
		: defaultSortingIconSet;

/**
 * A component to be used as the column headers
 */
const TableHeader: React.FC<
	TableCellProps & {
		property: ProcessableItemProperty;
	}
> = ({ property, children, ...props }) => {
	const dispatch = useInventoryStoreDispatch();

	const sorting = useInventoryStore((s) => s.ui.sorting);
	const filterPopoverIsOpen = useInventoryStore(
		(state) =>
			matchesSchema(property, filterableItemPropertySchema) &&
			selectPropertyFilterMenuIsOpen(property)(state)
	);
	const sortingIcons = determineIconSet(property);
	const isFilterable = matchesSchema(property, filterableItemPropertySchema);
	const isBeingSorted = sorting?.property === property;

	const onSort = () => {
		if (matchesSchema(property, sortableItemPropertySchema)) {
			dispatch({
				type: "ui.toggle-sort",
				payload: property,
			});
		}
	};

	const onPopoverOpen = () =>
		isFilterable &&
		dispatch({
			type: "ui.open-filter-menu",
			payload: property,
		});

	const onPopoverClose = () => dispatch({ type: "ui.close-filter-menu" });

	return (
		<TableCell {...props} as={Th}>
			<Button variant="ghost" onClick={onSort}>
				<Text marginRight="group">{children}</Text>
				{isBeingSorted && sortingIcons[sorting.direction]}
			</Button>
			{isFilterable && (
				<TableFilter
					isOpen={filterPopoverIsOpen}
					onClose={onPopoverClose}
					property={property}
					{...(property === "carriedByCharacterId" && {
						heading: "Carried By",
					})}
				>
					<IconButton
						aria-label="filter"
						icon={<FilterOutlineIcon />}
						onClick={onPopoverOpen}
						variant="ghost"
						isRound
						marginLeft="group"
					/>
				</TableFilter>
			)}
		</TableCell>
	);
};

/**
 * Table that shows items in a sheet inventory
 *
 * @param props Component props
 * @param props.items The items in the inventory
 * @param props.onRowClick Callback to execute when an item row is clicked.
 * The item's fields are passed as a parameter
 * @param props.filters The currently active filters
 * @param props.onFilterChange Callback to execute when a filter is edited
 * @param props.search The active search query
 * @returns The rendered html components
 */
const InventorySheetTable: React.FC<InventorySheetTableProps> = ({
	onRowClick,
	...props
}) => {
	const dispatch = useInventoryStoreDispatch();
	const hoverBg = useColorModeValue("gray.100", "gray.700");

	const columnSums = useInventoryStore(selectOverallColumnSums);
	const processedItems = useInventoryStore(selectVisibleItems);

	return (
		<Table
			colorScheme="gray"
			{...props}
			borderTopWidth={1}
			borderTopColor={hoverBg}
			data-testid={inventoryTableTestIds.tableRoot}
			id="items-table"
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
						property="carriedByCharacterId"
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
						onClick={() =>
							dispatch({
								type: "ui.open-item-edit-dialog",
								payload: item.id,
							})
						}
						cursor="pointer"
						_hover={{ backgroundColor: hoverBg }}
						data-testid={`item-row-${item.name}`}
					>
						{/* Item Name */}
						<TableCell textAlign="left" data-column="name">
							{item.referenceLink && isUrl(item.referenceLink) ? (
								<Link
									href={item.referenceLink}
									isExternal
									onClick={(e) => e.stopPropagation()}
									data-testid="referenceLink-link"
								>
									{item.name} <BookOutlineIcon marginLeft={1} />
								</Link>
							) : (
								item.name
							)}
						</TableCell>
						{/* Item Quantity */}
						<TableCell data-column="quantity">{item.quantity}</TableCell>
						{/* Item Total Weight */}
						<TableCell data-column="weight">
							{getItemTotalWeight(item)}
						</TableCell>
						{/* Item Total Value */}
						<TableCell data-column="value" display={col4Display}>
							{getItemTotalValue(item)}
						</TableCell>
						{/* Item "carriedByCharacterId" */}
						<TableCell data-column="carriedByCharacterId" display={col5Display}>
							<PartyMemberData
								memberId={item.carriedByCharacterId ?? ""}
								property="name"
							/>
						</TableCell>
						{/* Item Category */}
						<TableCell data-column="category" display={col6Display}>
							{item.category}
						</TableCell>
					</Tr>
				))}
				<Tr>
					{/* Bottom Sums Row */}
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

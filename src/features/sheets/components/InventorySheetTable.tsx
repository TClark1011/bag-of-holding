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
	Tooltip,
	useColorModeValue,
	VisuallyHidden,
	Td,
} from "@chakra-ui/react";
import { BookOutlineIcon, FilterOutlineIcon } from "chakra-ui-ionicons";
import { getItemTotalValue, getItemTotalWeight } from "$sheets/utils";
import { testIdGeneratorFactory } from "$tests/utils/testUtils";
import { ProcessableItemProperty } from "$sheets/types";
import {
	selectOverallColumnSums,
	composeSelectPropertyFilterMenuIsOpen,
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
import { TableFilter } from "$sheets/components";
import { SortingDirection } from "$root/types";
import { Character, Item } from "@prisma/client";
import { isUrl } from "$root/utils";
import { matchesSchema } from "$zod-helpers";
import {
	filterableItemPropertySchema,
	sortableItemPropertySchema,
} from "$sheets/types";
import { itemPropertyLabels } from "$sheets/constants";
import { useBreakpointVisibleColumns } from "$sheets/hooks";
import EntityData from "$sheets/components/EntityData";
import { useRenderLogging } from "$root/hooks";
import { FC, PropsWithChildren } from "react";

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

const multiplicationSymbol = "\u00D7";

const composeTotalColumnTooltipMessage = (property: string) =>
	`Shows the total ${property} of all the instances of the item (${property} ${multiplicationSymbol} quantity) `;

/**
 * A component to be used as the column headers
 */
const TableHeader: React.FC<
	TableCellProps & {
		property: ProcessableItemProperty;
		tooltip?: string;
	}
> = ({ property, children, tooltip, ...props }) => {
	const dispatch = useInventoryStoreDispatch();

	const sorting = useInventoryStore((s) => s.ui.sorting, []);
	const filterPopoverIsOpen = useInventoryStore(
		(state) =>
			matchesSchema(property, filterableItemPropertySchema) &&
			composeSelectPropertyFilterMenuIsOpen(property)(state),
		[property]
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

	const ButtonWrapper: FC<PropsWithChildren> = ({ children }) => {
		if (tooltip) {
			return (
				<Tooltip label={tooltip} hasArrow openDelay={500} placement="top">
					{children}
				</Tooltip>
			);
		}

		return <>{children}</>;
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
			<ButtonWrapper>
				<Button variant="ghost" onClick={onSort}>
					{children}
					{isBeingSorted && sortingIcons[sorting.direction]}
				</Button>
			</ButtonWrapper>
			{isFilterable && (
				<TableFilter
					isOpen={filterPopoverIsOpen}
					onClose={onPopoverClose}
					property={property}
					heading={itemPropertyLabels[property]}
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

const selectPossiblyUndefinedCharacterName = (
	character: Character | undefined
): string | undefined => character?.name;

const InventorySheetTable: React.FC<TableProps> = (props) => {
	useRenderLogging("InventorySheetTable");

	const dispatch = useInventoryStoreDispatch();
	const hoverBg = useColorModeValue("gray.100", "gray.700");

	const columnSums = useInventoryStore(selectOverallColumnSums, []);
	const processedItems = useInventoryStore(selectVisibleItems, []);

	const visibleColumns = useBreakpointVisibleColumns();

	const composeItemRowClickHandler = (item: Item) => () => {
		dispatch({
			type: "ui.open-item-edit-dialog",
			payload: {
				itemId: item.id,
			},
		});
	};

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
						// tooltip="The weight shown is the total weight of all the instances of an item."
						tooltip={composeTotalColumnTooltipMessage("weight")}
						data-testid={inventoryTableTestIds.weightColumnHeader}
					>
						Weight
					</TableHeader>

					{visibleColumns >= 4 && (
						<TableHeader
							property="value"
							data-testid={inventoryTableTestIds.valueColumnHeader}
							tooltip={composeTotalColumnTooltipMessage("value")}
						>
							Value
						</TableHeader>
					)}
					{visibleColumns >= 5 && (
						<TableHeader
							property="carriedByCharacterId"
							data-testid={inventoryTableTestIds.carriedByColumnHeader}
						>
							Carried By
						</TableHeader>
					)}
					{visibleColumns >= 6 && (
						<TableHeader
							property="category"
							data-testid={inventoryTableTestIds.categoryColumnHeader}
						>
							Category
						</TableHeader>
					)}

					{/* For invisible button on each row */}
					<VisuallyHidden as={Th}></VisuallyHidden>
				</Tr>
			</Thead>
			<Tbody>
				{processedItems.map((item) => (
					<Tr
						key={item.id}
						onClick={composeItemRowClickHandler(item)}
						cursor="pointer"
						sx={{
							"&:hover,&:focus-within": {
								backgroundColor: hoverBg,
							},
						}}
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
						{visibleColumns >= 4 && (
							<TableCell data-column="value">
								{getItemTotalValue(item)}
							</TableCell>
						)}
						{/* Item "carriedByCharacterId" */}
						{visibleColumns >= 5 && (
							<TableCell data-column="carriedByCharacterId">
								<EntityData
									entityType="characters"
									entityId={item.carriedByCharacterId ?? ""}
									selector={selectPossiblyUndefinedCharacterName}
								/>
							</TableCell>
						)}
						{/* Item Category */}
						{visibleColumns >= 6 && (
							<TableCell data-column="category">{item.category}</TableCell>
						)}

						{/* Workaround to allow for accessibility and keyboard navigation
								of the table.  */}
						<VisuallyHidden as={Td}>
							<Button
								variant="unstyled"
								onClick={composeItemRowClickHandler(item)}
							>
								Edit {item.name}
							</Button>
						</VisuallyHidden>
					</Tr>
				))}
				<Tr>
					<TableCell colSpan={2} fontWeight="bold" textAlign="right">
						Total
					</TableCell>
					<TableCell>
						{/* Sum of item Weights */}
						{columnSums.weight}
					</TableCell>
					{visibleColumns >= 4 && (
						<TableCell>
							{/* Sum of item values */}
							{columnSums.value}
						</TableCell>
					)}
					{visibleColumns >= 5 && <TableCell />}
					{visibleColumns >= 6 && <TableCell />}

					{/* For hidden button column */}
					<VisuallyHidden as={Td} />
				</Tr>
			</Tbody>
		</Table>
	);
};

export default InventorySheetTable;

import { chakra } from "@chakra-ui/system";
import { Table, TableProps, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import InventoryItemFields from "../../types/InventoryItemFields";
import { useSheetState } from "../contexts/SheetStateContext";

const numericTableCellProps = {
	paddingX: 2,
	sx: { textAlign: "center" },
};

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
	...props
}) => {
	// TODO: Add type column
	const { items } = useSheetState();
	return (
		<Table colorScheme="gray" {...props}>
			<Thead>
				<Tr>
					<Th>Name</Th>
					<Th {...numericTableCellProps}>Quantity</Th>
					<Th {...numericTableCellProps}>Weight*</Th>
					<Th {...numericTableCellProps} {...col4Props}>
						Value
					</Th>
					<Th {...numericTableCellProps} {...col5Props}>
						Carried By
					</Th>
					<Th {...numericTableCellProps} {...col6Props}>
						Category
					</Th>
				</Tr>
			</Thead>
			<Tbody>
				{items.map((item) => (
					<Tr
						key={item._id}
						onClick={() => onRowClick(item)}
						cursor="pointer"
						_hover={{ backgroundColor: "gray.100" }}
					>
						<Td>{item.name}</Td>
						<Td {...numericTableCellProps}>{item.quantity}</Td>
						<Td {...numericTableCellProps}>{item.weight * item.quantity}</Td>
						<Td {...numericTableCellProps} {...col4Props}>
							{item.value}
						</Td>
						<Td {...numericTableCellProps} {...col5Props}>
							{item.carriedBy || "Nobody"}
						</Td>
						<Td {...numericTableCellProps} {...col6Props}>
							{item.category || "None"}
						</Td>
					</Tr>
				))}
				{/* Bottom Row */}
				<Tr>
					<Td colSpan={2} fontWeight="bold" textAlign="right">
						Total
					</Td>
					<Td {...numericTableCellProps}>
						{items.reduce<number>(
							(accumulator, item) => accumulator + item.weight * item.quantity,
							0
						)}
					</Td>
					<Td {...numericTableCellProps} {...col4Props}>
						{items.reduce<number>(
							(accumulator, item) => accumulator + item.value * item.quantity,
							0
						)}
					</Td>
					<Td {...col5Props} />
				</Tr>
			</Tbody>
		</Table>
	);
};

export default InventorySheetTable;

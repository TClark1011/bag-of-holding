import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import InventoryItemFields from "../../types/InventoryItemFields";

const numericTableCellProps = {
	paddingX: 2,
	sx: { textAlign: "center" },
};

const tableHeaderProps = {
	color: "gray.50",
};

export interface InventorySheetTableProps {
	items: InventoryItemFields[];
	compactMode: boolean;
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
	items,
	onRowClick,
}) => (
	<Table colorScheme="gray">
		<Thead>
			<Tr backgroundColor="primary.500">
				<Th {...tableHeaderProps}>Name</Th>
				<Th {...numericTableCellProps} {...tableHeaderProps}>
					Quantity
				</Th>
				<Th {...numericTableCellProps} {...tableHeaderProps}>
					Weight*
				</Th>
			</Tr>
		</Thead>
		<Tbody>
			{items.map(({ _id, name, quantity, weight, ...item }) => (
				<Tr
					key={_id}
					onClick={() => onRowClick({ _id, name, quantity, weight, ...item })}
				>
					<Td>{name}</Td>
					<Td {...numericTableCellProps}>{quantity}</Td>
					<Td {...numericTableCellProps}>{weight * quantity}</Td>
				</Tr>
			))}
		</Tbody>
	</Table>
);

export default InventorySheetTable;

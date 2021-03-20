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
}

/**
 * Table that shows items in a sheet inventory
 *
 * @param {object} props Component props
 * @param {InventoryItemFields[]} props.items The items in the inventory
 * @returns {React.ReactElement} The rendered htmk components
 */
const InventorySheetTable: React.FC<InventorySheetTableProps> = ({ items }) => (
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
			{items.map(({ _id, name, quantity, weight }) => (
				<Tr key={_id}>
					<Td>{name}</Td>
					<Td {...numericTableCellProps}>{quantity}</Td>
					<Td {...numericTableCellProps}>{weight * quantity}</Td>
				</Tr>
			))}
		</Tbody>
	</Table>
);

export default InventorySheetTable;

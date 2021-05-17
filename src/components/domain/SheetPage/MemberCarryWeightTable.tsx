import { Table, TableProps, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { useInventoryState } from "../../contexts/InventoryStateContext";

/**
 * Component for showing the total carry weight/value of each party member's inventory
 *
 * @param {chakra.TableProps} props The props to pass to the table
 * @returns {React.ReactElement} The rendered stuff
 */
const MemberCarryWeightTable: React.FC<TableProps> = ({ ...props }) => {
	const { members, items } = useInventoryState();
	/**
	 * Fetch the items carried by a certain member
	 *
	 * @param {string} memberId The '_id' of the member to fetch the items of
	 * @returns {InventoryItemFields[]} The items carried by te specified character
	 */
	const getCarriedItems = (memberId: string) =>
		items.filter((item) => item.carriedBy === memberId);
	return (
		<Table {...props}>
			<Thead>
				<Tr>
					<Th>Character</Th>
					<Th>Weight</Th>
					<Th>Value</Th>
				</Tr>
			</Thead>
			<Tbody>
				{members.map(({ _id, name }) => (
					<Tr key={_id}>
						<Td>{name}</Td>
						<Td>
							{getCarriedItems(_id).reduce<number>(
								(total, current) =>
									(total += current.weight * current.quantity),
								0
							)}
						</Td>
						<Td>
							{getCarriedItems(_id).reduce<number>(
								(total, current) => (total += current.value * current.quantity),
								0
							)}
						</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};

export default MemberCarryWeightTable;

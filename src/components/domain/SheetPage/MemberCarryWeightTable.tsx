import { Table, TableProps, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { useInventoryState } from "../../contexts/InventoryStateContext";
import { getItemTotalWeight, getItemTotalValue } from "../../../utils/deriveItemProperties";
import Big from "big.js";

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
	 * @param {string} member The name of the member to fetch the items of
	 * @returns {InventoryItemFields[]} The items carried by te specified character
	 */
	const getCarriedItems = (member: string) =>
		items.filter((item) => item.carriedBy === member);
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
				{members.map((member) => (
					<Tr key={member}>
						<Td>{member}</Td>
						<Td>
							{getCarriedItems(member).reduce<number>(
								(total, current) =>
									(total = Number(Big(total).plus(getItemTotalWeight(current)))),
								0
							)}
						</Td>
						<Td>
							{getCarriedItems(member).reduce<number>(
								(total, current) =>
								(total = Number(Big(total).plus(getItemTotalValue(current)))),
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

import { Table, TableProps, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import Big from "big.js";
import {
	getItemTotalValue,
	getItemTotalWeight,
} from "../../../utils/deriveItemProperties";
import { testIdGeneratorFactory } from "../../../../tests/utils/testUtils";
import { useInventoryState } from "../../contexts/InventoryStateContext";

const getTestId = testIdGeneratorFactory("MemberCarryWeightTable");

export const memberCarryWeightTableTestIds = {
	root: getTestId("root"),
};

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
		<Table {...props} data-testid={memberCarryWeightTableTestIds.root}>
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
						{/* Total weight cell */}
						<Td>
							{getCarriedItems(_id).reduce<number>(
								(total, current) =>
									new Big(total).add(getItemTotalWeight(current)).toNumber(),
								0
							)}
						</Td>
						{/* Total value cell */}
						<Td>
							{getCarriedItems(_id).reduce<number>(
								(total, current) =>
									new Big(total).add(getItemTotalValue(current)).toNumber(),
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

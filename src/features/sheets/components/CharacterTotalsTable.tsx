import { useInventoryState } from "$sheets/providers";
import { getItemTotalValue, getItemTotalWeight } from "$sheets/utils";
import { testIdGeneratorFactory } from "$tests/utils/testUtils";
import { Table, TableProps, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import Big from "big.js";

const getTestId = testIdGeneratorFactory("MemberTotalsTable");

export const characterTotalsTableTestIds = {
	root: getTestId("root"),
};

/**
 * Component for showing the total carry weight/value of each party member's inventory
 *
 * @param props The props to pass to the table
 * @returns The rendered stuff
 */
const CharacterTotalsTable: React.FC<TableProps> = ({ ...props }) => {
	const { characters, items } = useInventoryState();
	/**
	 * Fetch the items carried by a certain member
	 *
	 * @param memberId The 'id' of the member to fetch the items of
	 * @returns The items carried by te specified character
	 */
	const getCarriedItems = (memberId: string) =>
		items.filter((item) => item.carriedByCharacterId === memberId);
	return (
		<Table {...props} data-testid={characterTotalsTableTestIds.root}>
			<Thead>
				<Tr>
					<Th>Character</Th>
					<Th>Weight</Th>
					<Th>Value</Th>
				</Tr>
			</Thead>
			<Tbody>
				{characters.map(({ id, name }) => (
					<Tr key={id}>
						<Td>{name}</Td>
						{/* Total weight cell */}
						<Td>
							{getCarriedItems(id).reduce<number>(
								(total, current) =>
									new Big(total).add(getItemTotalWeight(current)).toNumber(),
								0
							)}
						</Td>
						{/* Total value cell */}
						<Td>
							{getCarriedItems(id).reduce<number>(
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

export default CharacterTotalsTable;

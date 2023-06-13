import {
	selectAllCharacterColumnTotals,
	useInventoryStore,
} from "$sheets/store";
import { testIdGeneratorFactory } from "$tests/utils/testUtils";
import { Table, TableProps, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";

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
	const sums = useInventoryStore(selectAllCharacterColumnTotals, []);
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
				{sums.map(({ character, sums }) => (
					<Tr key={character.id}>
						<Td>{character.name}</Td>
						{/* Total weight cell */}
						<Td>{sums.weight}</Td>
						{/* Total value cell */}
						<Td>{sums.value}</Td>
					</Tr>
				))}
			</Tbody>
		</Table>
	);
};

export default CharacterTotalsTable;

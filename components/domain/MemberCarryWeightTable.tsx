import { Table, TableProps, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import { useSheetState } from "../contexts/SheetStateContext";

/**
 * @param root0
 */
const MemberCarryWeightTable: React.FC<TableProps> = ({ ...props }) => {
	const { members, items } = useSheetState();
	/**
	 * @param member
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
									(total += current.weight * current.quantity),
								0
							)}
						</Td>
						<Td>
							{getCarriedItems(member).reduce<number>(
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

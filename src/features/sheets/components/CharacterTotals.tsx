import { H3 } from "$root/components";
import CharacterTotalsTable from "$sheets/components/CharacterTotalsTable";
import { Center, Divider, Flex } from "@chakra-ui/react";
import { FC } from "react";

/**
 *
 */
const CharacterTotals: FC = () => {
	return (
		<>
			<Flex width="full">
				<Center flexGrow={1}>
					<Divider />
				</Center>
				<H3
					fontWeight="300"
					flexShrink={1}
					textAlign="center"
					display="inline"
					paddingX="break"
				>
					Party Member Totals
				</H3>
				<Center flexGrow={1}>
					<Divider />
				</Center>
			</Flex>
			<CharacterTotalsTable />
		</>
	);
};

export default CharacterTotals;

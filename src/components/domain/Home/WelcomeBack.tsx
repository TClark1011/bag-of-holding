import {
	Box,
	BoxProps,
	Divider,
	SimpleGrid,
	useBreakpointValue,
	useColorModeValue,
} from "@chakra-ui/react";
import { sort } from "fast-sort";
import { useRememberedSheets } from "$sheets/hooks";
import { H3, RememberedSheet } from "$root/components";

/**
 * The 'welcome back' section in the homepage
 *
 * @param props The props
 * @returns Component stuff
 */
const WelcomeBack: React.FC<BoxProps> = (props) => {
	const rememberedSheets = useRememberedSheets();

	/**
	 * Calculate how many columns to use in the SheetCard
	 * grid
	 *
	 * @param columns The maximum number of columns
	 * to use
	 * @returns Either the provided columns number,
	 * or the length of the 'rememberedSheets' length, whichever
	 * is lower
	 */
	const getRememberedSheetCardColumns = (columns: number) =>
		Math.min(rememberedSheets.length, columns);

	const rememberedSheetCardColumns = useBreakpointValue([
		getRememberedSheetCardColumns(1),
		getRememberedSheetCardColumns(2),
		getRememberedSheetCardColumns(4),
	]);

	const dividerColor = useColorModeValue("gray.500", "gray.200");

	return rememberedSheets.length ? (
		<Box {...props}>
			<Divider backgroundColor={dividerColor} borderColor={dividerColor} />
			<H3 marginY="break" textAlign="center">
				Welcome Back
			</H3>
			<SimpleGrid columns={rememberedSheetCardColumns} spacing="break">
				{sort(rememberedSheets)
					.desc("lastAccessedAt")
					.slice(0, 4)
					.map((props, index) => (
						<RememberedSheet {...props} key={index} />
					))}
			</SimpleGrid>
		</Box>
	) : null;
};

export default WelcomeBack;

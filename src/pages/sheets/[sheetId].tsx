import {
	Box,
	Center,
	Divider,
	Flex,
	Heading,
	SimpleGrid,
	Stack,
	useInterval,
	Button,
	IconButton,
	DarkMode,
	LightMode,
	Tag,
	TagLabel,
	TagLeftIcon,
	Input,
} from "@chakra-ui/react";
import { Reducer, useEffect, useReducer } from "react";
import { InventoryStateProvider } from "$sheets/providers";
import { REFETCH_INTERVAL } from "$root/config";
import { GetServerSideProps } from "next";
import { AddIcon, CreateOutlineIcon } from "chakra-ui-ionicons";
import deepEqual from "deep-equal";
import { appName } from "$root/constants";
import { getUrlParam, getSheetLink } from "$root/utils";
import { useSheetPageState, inventoryReducer } from "$sheets/store";
import {
	WelcomeDialog,
	MemberTotalsTable,
	FilterDialog,
	InventorySheetTable,
	SheetOptionsDialog,
	ItemDialog,
} from "$sheets/components";
import fetchSheetFromDb from "../../db/fetchSheetFromDb";
import { testIdGeneratorFactory } from "$tests/utils/testUtils";
import {
	InventorySheetFields,
	InventorySheetStateAction,
	InventorySheetState,
} from "$sheets/types";
import { fetchSheet } from "$sheets/api";
import {
	H3,
	PartyMemberTagList,
	ColorModeSwitch,
	View,
} from "$root/components";
import { addToRememberedSheets } from "$sheets/utils";

const getTestId = testIdGeneratorFactory("SheetPage");

export const sheetPageTestIds = {
	colorModeButton: getTestId("ColorModeButton"),
	sheetOptionsButton: getTestId("SheetOptionsButton"),
};

export interface SheetPageProps extends InventorySheetFields {
	isNew?: boolean;
}

/**
 * The page for a specific sheet
 *
 * @param sheetFields The component sheetFields
 * @param [sheetFields.isNew=false] Whether or not the sheet is newly created
 * @param sheetFields.name The name of the sheet
 * @param sheetFields.items The items in the sheet
 * @param sheetFields.members Members
 * @returns Sheet component
 */
const Sheet: React.FC<SheetPageProps> = ({ isNew = false, ...sheetFields }) => {
	const [{ items, name, members, _id }, inventoryDispatch] = useReducer<
		Reducer<InventorySheetState, InventorySheetStateAction>
	>(inventoryReducer, {
		...sheetFields,
		blockRefetch: {
			for: 0,
			from: new Date(),
		},
	});

	useEffect(() => {
		if (isNew) {
			openDialog("welcome");
			//? Open the welcome dialog if the sheet is new
		}
	}, []);

	useEffect(() => {
		addToRememberedSheets({ _id, name, members });
		//? Store the sheet to the list of 'remembered' sheets
	}, [_id, name, members]);

	const {
		openDialog,
		searchbarValue,
		searchbarOnChange,
		resetFilters,
	} = useSheetPageState();

	/**
	 * Refetch the data regularly
	 */
	useInterval(() => {
		fetchSheet(sheetFields._id).then(({ data }) => {
			if (
				!deepEqual(items, data.items) ||
				!deepEqual(name, data.name) ||
				!deepEqual(members, data.members)
			)
				inventoryDispatch({ type: "sheet_update", data });
		});
	}, REFETCH_INTERVAL);

	return (
		<View
			showTopNav={false}
			title={appName + " - " + name}
			url={getSheetLink(sheetFields._id, true)}
			analyticsPageViewProps={{ title: "Sheet", url: "/sheets/[sheetId]" }}
		>
			<InventoryStateProvider
				dispatch={inventoryDispatch}
				state={{ items, members, name, _id }}
			>
				<Box>
					<main>
						{/* Top Bar */}
						<Box
							padding={2}
							backgroundColor="gray.900"
							color="gray.50"
							boxShadow="lg"
						>
							<Flex justify="space-between" marginBottom="group">
								<Flex>
									{/* Sheet Title */}
									<Heading marginRight={1}>{name}</Heading>
									{/* Sheet Options Button */}
									<DarkMode>
										<IconButton
											aria-label="edit sheet settings"
											icon={<CreateOutlineIcon boxSize={6} />}
											onClick={() => openDialog("sheetOptions")}
											variant="ghost"
											isRound
											data-testid={sheetPageTestIds.sheetOptionsButton}
										/>
									</DarkMode>
								</Flex>
								{/* Color Mode Switch */}
								<ColorModeSwitch
									useDarkModeColors
									data-testid={sheetPageTestIds.colorModeButton}
								/>
							</Flex>
							<LightMode>
								{members.length ? (
									<PartyMemberTagList
										members={members.map((member) => member.name)}
									/>
								) : (
									<Tag
										_hover={{ backgroundColor: "gray.300" }}
										cursor="pointer"
										onClick={() => openDialog("sheetOptions")}
									>
										<TagLeftIcon as={AddIcon} />
										<TagLabel>Add Members</TagLabel>
									</Tag>
								)}
							</LightMode>
						</Box>
						<Stack
							minHeight={16}
							padding="group"
							direction={["column-reverse", "column-reverse", "row"]}
						>
							<Box>
								{/* Add new Item Button */}
								<Button
									colorScheme="primary"
									onClick={() => openDialog("item.new")}
									width="full"
								>
									Add New Item
								</Button>
							</Box>
							<Box flexGrow={2}>
								{/* Search Bar */}
								<Input
									width="full"
									placeholder="Search"
									onChange={searchbarOnChange}
									value={searchbarValue}
								/>
								{/* NOTE: Updates may stutter in dev mode but is fine when built */}
							</Box>
							<Box>
								<SimpleGrid columns={[2, 2, 2, 1]} gap="group">
									{/* Reset Filters Button */}
									<Button width="full" onClick={resetFilters}>
										Reset Filters
									</Button>
									{/* Filter Options Dialog Button */}
									<Button
										width="full"
										display={[
											"inline-flex",
											"inline-flex",
											"inline-flex",
											"none",
										]}
										onClick={() => openDialog("filter")}
									>
										Filters
									</Button>
								</SimpleGrid>
							</Box>
						</Stack>
						<InventorySheetTable
							onRowClick={(item) => openDialog("item.edit", item)}
							marginBottom="break"
						/>
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
						<MemberTotalsTable />
						{/* Dialogs */}
						<ItemDialog mode="new" />
						<ItemDialog mode="edit" />
						<FilterDialog />
						<SheetOptionsDialog />
						<WelcomeDialog />
					</main>
				</Box>
			</InventoryStateProvider>
		</View>
	);
};

/**
 * Get the props rendered by the server
 *
 * @param context Path context data
 * @param context.params Path url parameters
 * @param context.params.sheetId The sheet id in the ur;
 * @returns The props for the sheet
 */
export const getServerSideProps: GetServerSideProps<InventorySheetFields> = async (
	context
) => {
	const sheetData = await fetchSheetFromDb(getUrlParam(context.params.sheetId));
	return {
		props: { ...sheetData, isNew: typeof context.query.new !== "undefined" },
	};
};

export default Sheet;

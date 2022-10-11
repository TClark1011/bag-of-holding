import { Box } from "@chakra-ui/react";
import { InventoryStateProvider } from "$sheets/providers";
import { GetServerSideProps } from "next";
import { appName } from "$root/constants";
import { getUrlParam, getSheetLink } from "$root/utils";
import {
	useSheetPageState,
	useInventoryReducer,
	useInventoryStore,
	useInventoryStoreDispatch,
	fromSheet,
} from "$sheets/store";
import {
	WelcomeDialog,
	FilterDialog,
	InventorySheetTable,
	SheetOptionsDialog,
	ItemDialog,
} from "$sheets/components";
import { testIdGeneratorFactory } from "$tests/utils/testUtils";
import { View } from "$root/components";
import { useOnMountEffect } from "$root/hooks";
import { Sheet } from "@prisma/client";
import { FullSheet } from "$sheets/types";
import useSheetServerSync from "$sheets/hooks/useSheetServerSync";
import CharacterDialog from "$sheets/components/Dialogs/CharacterDialog";
import { D } from "@mobily/ts-belt";
import SheetNameDialog from "$sheets/components/Dialogs/SheetNameDialog";
import SheetTopBar from "$sheets/components/SheetTopBar";
import SheetActions from "$sheets/components/SheetActions";
import CharacterTotals from "$sheets/components/CharacterTotals";

const getTestId = testIdGeneratorFactory("SheetPage");

export const sheetPageTestIds = {
	colorModeButton: getTestId("ColorModeButton"),
	sheetOptionsButton: getTestId("SheetOptionsButton"),
};

export interface SheetPageProps extends FullSheet {
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
const SheetPage: React.FC<SheetPageProps> = ({
	isNew = false,
	...sheetFields
}) => {
	const dispatch = useInventoryStoreDispatch();
	useOnMountEffect(() => {
		dispatch({
			type: "set-sheet",
			payload: sheetFields,
		});
	});
	useSheetServerSync();

	const { characters, name } = useInventoryStore(
		fromSheet(D.selectKeys(["characters", "name"]))
	);

	const [{ items, id }, inventoryDispatch] = useInventoryReducer(sheetFields);

	useOnMountEffect(() => {
		if (isNew) {
			openDialog("welcome");
			//? Open the welcome dialog if the sheet is new
		}
	});

	const { openDialog } = useSheetPageState();

	return (
		<View
			showTopNav={false}
			title={`${appName} - ${name}`}
			url={getSheetLink(sheetFields.id, true)}
			analyticsPageViewProps={{ title: "Sheet", url: "/sheets/[sheetId]" }}
		>
			<InventoryStateProvider
				dispatch={inventoryDispatch}
				state={{ items, characters, name, id }}
			>
				<Box as="main">
					<SheetTopBar />
					<SheetActions />
					<InventorySheetTable
						onRowClick={(item) => openDialog("item.edit", item)}
						marginBottom="break"
					/>
					<CharacterTotals />

					{/* Dialogs */}
					<ItemDialog mode="new" />
					<ItemDialog mode="edit" />
					<FilterDialog />
					<SheetOptionsDialog />
					<WelcomeDialog />
					<CharacterDialog />
					<SheetNameDialog />
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
export const getServerSideProps: GetServerSideProps<Sheet> = async (
	context
) => {
	const prisma = await import("$prisma").then((r) => r.default);
	const sheetId = getUrlParam(context?.params?.sheetId ?? []);
	// We import like this because importing backend code
	// into a frontend file causes an error in testing.
	// This way we are only importing the backend code
	// when this function actually runs.
	const sheetData = await prisma.sheet.findFirstOrThrow({
		where: { id: sheetId },
		include: {
			items: true,
			characters: true,
		},
	});
	return {
		props: { ...sheetData, isNew: typeof context.query.new !== "undefined" },
	};
};

export default SheetPage;

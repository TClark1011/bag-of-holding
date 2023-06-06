import { Box } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { appName } from "$root/constants";
import { getUrlParam, getSheetLink } from "$root/utils";
import {
	useInventoryStore,
	useInventoryStoreDispatch,
	fromSheet,
} from "$sheets/store";
import {
	WelcomeDialog,
	FilterDialog,
	InventorySheetTable,
	ItemDialog,
	InventoryDataFetchingEffects,
	RememberSheetEffect,
} from "$sheets/components";
import { testIdGeneratorFactory } from "$tests/utils/testUtils";
import { View } from "$root/components";
import { useOnMountEffect } from "$root/hooks";
import { Sheet } from "@prisma/client";
import { FullSheet } from "$sheets/types";
import CharacterDialog from "$sheets/components/Dialogs/CharacterDialog";
import SheetNameDialog from "$sheets/components/Dialogs/SheetNameDialog";
import SheetTopBar from "$sheets/components/SheetTopBar";
import SheetActions from "$sheets/components/SheetActions";
import CharacterTotals from "$sheets/components/CharacterTotals";
import useRenderLogging from "$root/hooks/useRenderLogging";
import { get } from "$fp";

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
	useRenderLogging("SheetPage");

	const dispatch = useInventoryStoreDispatch();

	const name = useInventoryStore(fromSheet(get("name")));

	useOnMountEffect(() => {
		dispatch({
			type: "set-sheet",
			payload: sheetFields,
		});
	});

	useOnMountEffect(() => {
		if (isNew) {
			dispatch({
				type: "ui.open-welcome-dialog",
			});
			//? Open the welcome dialog if the sheet is new
		}
	});

	return (
		<>
			<InventoryDataFetchingEffects />
			<RememberSheetEffect />

			<View
				showTopNav={false}
				title={`${appName} - ${name}`}
				url={getSheetLink(sheetFields.id, true)}
				analyticsPageViewProps={{ title: "Sheet", url: "/sheets/[sheetId]" }}
			>
				<Box as="main">
					<SheetTopBar />
					<SheetActions />
					<InventorySheetTable
						onRowClick={(item) =>
							dispatch({
								type: "ui.open-item-edit-dialog",
								payload: item?.id ?? "",
							})
						}
						mb="break"
					/>
					<CharacterTotals />

					{/* Dialogs */}
					<ItemDialog />
					<FilterDialog />
					<WelcomeDialog />
					<CharacterDialog />
					<SheetNameDialog />
				</Box>
			</View>
		</>
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

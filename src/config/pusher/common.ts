import { ResolvedInventoryStoreAction } from "$sheets/store";

export type ChannelToDataMap = {
	sheet: ResolvedInventoryStoreAction;
};

/**
 * Compose the name of a channel for a given sheet
 *
 * @param sheetId The id of the sheet
 */
export const sheetChannelName = (sheetId: string) =>
	`sheet-${sheetId}` as keyof Pick<ChannelToDataMap, "sheet">;

export const EVENT_NAME = "___";

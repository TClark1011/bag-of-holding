import InventorySheetFields from "../../src/types/InventorySheetFields";
import { healthPotionFixture, longswordFixture } from "./itemFixtures";
import { averageMembersFixture } from "./membersFixtures";

export const basicSheetFixture: InventorySheetFields = {
	_id: "basicSheetId",
	name: "Basic Sheet",
	members: averageMembersFixture,
	items: [longswordFixture, healthPotionFixture],
};

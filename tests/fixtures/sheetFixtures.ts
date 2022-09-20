import { FullSheet } from "$sheets/types";
import { healthPotionFixture, longswordFixture } from "./itemFixtures";
import { averageMembersFixture } from "./charactersFixtures";

export const basicSheetFixture: FullSheet = {
	id: "basicSheetId",
	name: "Basic Sheet",
	characters: averageMembersFixture,
	items: [longswordFixture, healthPotionFixture],
	updatedAt: new Date(),
};

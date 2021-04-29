import { inProduction } from "../src/config/publicEnv";
import connectToMongoose from "../src/db/connectToMongoose";
import { ProductionSheetModel } from "../src/db/SheetModel";
import InventoryMemberFields from "../src/types/InventoryMemberFields";
import generateMember from "../src/generators/generateMember";
import InventorySheetFields from "../src/types/InventorySheetFields";
import omit from "omit.js";

(async () => {
	if (!inProduction) {
		await connectToMongoose();
		const oldSheets = await ProductionSheetModel.find({
			"members.0": { $type: "string" },
		});
		await oldSheets.forEach((sheet) => {
			const updatedMembers: InventoryMemberFields[] = [];

			((((sheet as unknown) as InventorySheetFields)
				.members as unknown[]) as Record<string, string>[])
				.map((val) => JSON.parse(JSON.stringify(val)))
				.forEach((member) => {
					const fixedName = Object.values(
						omit(member, ["carryCapacity", "_id"])
					).reduce<string>((val, runningVal) => val + runningVal, "");

					updatedMembers.push(generateMember(fixedName));
				});

			ProductionSheetModel.updateOne(
				{ _id: sheet._id },
				{
					$set: {
						members: updatedMembers,
					},
				}
			).exec();
			updatedMembers.forEach((updatedMember) => {
				ProductionSheetModel.updateOne(
					{ _id: sheet._id, "items.carriedBy": updatedMember.name } as unknown,
					{
						$set: {
							"items.$.carriedBy": updatedMember._id,
						},
					}
				).exec();
			});
		});
	}

	return;
})();

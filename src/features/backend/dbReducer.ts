import {
	DeleteCharacterItemHandlingMethods,
	CharacterMoveDeleteMethod,
	isMoveDeleteMethod,
	SheetStatePartialUpdateAction,
} from "$sheets/types";
import { getIds } from "$root/utils";
import prisma from "$prisma";

/**
 * Reducer for controlling database
 *
 * @param sheetId The id of the sheet to
 * update
 * @param action The action used to update
 * the sheet
 */
const dbReducer = async (
	sheetId: string,
	action: SheetStatePartialUpdateAction
): Promise<void> => {
	switch (action.type) {
		case "item_add":
			await prisma.item.create({
				data: {
					...action.data,
					sheetId,
				},
			});
			break;
		case "item_remove":
			await prisma.item.delete({
				where: {
					id: action.data,
				},
			});
			break;
		case "item_update":
			await prisma.item.update({
				where: {
					id: action.data.id,
				},
				data: {
					...action.data,
					sheetId,
				},
			});
			break;
		case "sheet_metadataUpdate":
			if (action.data.name) {
				await prisma.sheet.update({
					where: {
						id: sheetId,
					},
					data: {
						name: action.data.name,
					},
				});
			}

			if (action.data?.characters?.add?.length) {
				await prisma.character.createMany({
					data: action.data?.characters?.add.map((character) => ({
						name: character.name,
						sheetId,
					})),
				});
			}

			if (action.data?.characters?.remove?.length) {
				// NOTE: The DB's default behaviour when a character is deleted is to set the
				// carriedByCharacterId field to null, so we don't have to do that manually

				const moveModeActions = action.data?.characters?.remove.filter((mem) =>
					isMoveDeleteMethod(mem.deleteMethod)
				);

				// Move items to other characters
				await Promise.all(
					moveModeActions.map(async (character) =>
						prisma.item.updateMany({
							where: {
								carriedByCharacterId: character.id,
							},
							data: {
								carriedByCharacterId: (character.deleteMethod as CharacterMoveDeleteMethod)
									.to,
							},
						})
					)
				);

				const deleteModeItems = action.data?.characters?.remove.filter(
					(i) =>
						i.deleteMethod.mode === DeleteCharacterItemHandlingMethods.delete
				);

				await prisma.item.deleteMany({
					where: {
						carriedByCharacterId: {
							in: getIds(deleteModeItems),
						},
					},
				});

				// const charactersWithNobodyMode = action.data?.characters?.remove.filter(
				// 	(mem) =>
				// 		mem.deleteMethod.mode ===
				// 		DeleteCharacterItemHandlingMethods.setToNobody
				// );

				// await prisma.item.updateMany({
				// 	where: {
				// 		carriedByCharacterId: {
				// 			in: getIds(charactersWithNobodyMode),
				// 		},
				// 	},
				// 	data: {
				// 		carriedByCharacterId: null,
				// 	},
				// });

				await prisma.character.deleteMany({
					where: {
						id: {
							in: getIds(action.data?.characters?.remove),
						},
					},
				});
			}

			if (action.data?.characters?.update?.length) {
				await Promise.all(
					action.data.characters.update.map((characterUpdate) =>
						prisma.character.update({
							where: {
								id: characterUpdate.id,
							},
							data: characterUpdate,
						})
					)
				);
			}

			break;
	}
};

export default dbReducer;

import prisma from "$prisma";
import { FullSheet } from "$sheets/types";
import { getCarriedItems } from "$sheets/utils";

export type SheetFlatDataCreation = Omit<FullSheet, "id" | "updatedAt"> &
	Partial<Pick<FullSheet, "updatedAt">>;

/**
 * Take the flat data of `FullSheet` and create the corresponding
 * entities in the database
 *
 * @param flatData The flat data of a `FullSheet`
 * @returns The created `FullSheet`
 */
const createSheetFromFlatData = async (
	flatData: SheetFlatDataCreation
): Promise<FullSheet> => {
	const baseSheet = await prisma.sheet.create({
		data: {
			name: flatData.name,
			updatedAt: flatData.updatedAt,
		},
	});

	await Promise.all(
		flatData.characters.map(async ({ id, ...character }) => {
			const carriedItems = getCarriedItems(flatData.items, id);
			return prisma.character.create({
				data: {
					...character,
					sheetId: baseSheet.id,
					carriedItems: {
						createMany: {
							data: carriedItems.map(({ id, ...item }) => ({
								...item,
								sheetId: baseSheet.id,
							})),
						},
					},
				},
			});
		})
	);

	const fullSheet = await prisma.sheet.findFirstOrThrow({
		where: {
			id: baseSheet.id,
		},
		include: {
			characters: true,
			items: true,
		},
	});

	return fullSheet;
};

export default createSheetFromFlatData;

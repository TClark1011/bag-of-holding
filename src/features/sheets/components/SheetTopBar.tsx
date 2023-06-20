import { ColorModeSwitch } from "$root/components";
import {
	characterDialogAtom,
	fromSheet,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import { useEntityTiedDialogAtom } from "$sheets/utils";
import {
	Box,
	Button,
	DarkMode,
	Flex,
	Heading,
	IconButton,
	LightMode,
} from "@chakra-ui/react";
import { D } from "@mobily/ts-belt";
import { AddIcon, CreateOutlineIcon, PencilIcon } from "chakra-ui-ionicons";
import { FC } from "react";

const SheetTopBar: FC = () => {
	const dispatch = useInventoryStoreDispatch();
	const { name, characters } = useInventoryStore(
		fromSheet(D.selectKeys(["name", "characters"])),
		[]
	);

	const {
		onOpenToEditEntityWithId: openCharacterEditDialog,
		onOpenToCreateNewEntity: openNewCharacterDialog,
	} = useEntityTiedDialogAtom(characterDialogAtom);

	return (
		<Box padding={2} backgroundColor="gray.900" color="gray.50" boxShadow="lg">
			<Flex justify="space-between" marginBottom="group">
				<Flex>
					{/* Sheet Title */}
					<Heading marginRight={1} as="h2" id="sheet-title">
						{name}
					</Heading>
					<DarkMode>
						{/* Sheet Options Button */}
						<IconButton
							id="options-button"
							aria-label="edit sheet name"
							icon={<CreateOutlineIcon boxSize={6} />}
							onClick={() =>
								dispatch({
									type: "ui.open-sheet-name-dialog",
								})
							}
							variant="ghost"
							isRound
						/>
					</DarkMode>
				</Flex>
				{/* Color Mode Switch */}
				<ColorModeSwitch useDarkModeColors />
			</Flex>
			<Flex gap="group" wrap="wrap">
				<LightMode>
					{characters.map((character) => (
						<Button
							size="xs"
							color="gray.800"
							colorScheme="gray"
							key={character.id}
							leftIcon={<PencilIcon />}
							className="character-tag" // for testing
							onClick={() => {
								openCharacterEditDialog(character.id);
							}}
						>
							{character.name}
						</Button>
					))}
					<Button
						size="xs"
						colorScheme="gray"
						color="gray.800"
						onClick={openNewCharacterDialog}
						leftIcon={<AddIcon />}
					>
						Add Character
					</Button>
				</LightMode>
			</Flex>
		</Box>
	);
};

export default SheetTopBar;

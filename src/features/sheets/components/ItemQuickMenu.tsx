import { ModeSensitiveColor, useModeSensitiveColor } from "$root/hooks";
import { withStoppedPropagation } from "$root/utils";
import { useEditItemMutation } from "$sheets/hooks";
import {
	itemDialogAtom,
	selectCharacters,
	standaloneItemDeleteConfirmDialogAtom,
	standaloneItemGiveToDialogAtom,
	useInventoryStore,
	useNullableIdTargetingDialogAtom,
} from "$sheets/store";
import { useEntityTiedDialogAtom } from "$sheets/utils";
import {
	IconButton,
	Menu,
	MenuButton,
	MenuButtonProps,
	MenuDivider,
	MenuGroup,
	MenuItem,
	MenuItemProps,
	MenuList,
	Spinner,
	useDisclosure,
} from "@chakra-ui/react";
import { A, flow } from "@mobily/ts-belt";
import { Item } from "@prisma/client";
import {
	EllipsisVerticalIcon,
	RemoveOutlineIcon,
	AddOutlineIcon,
	ExitOutlineIcon,
	TrashOutlineIcon,
	PencilOutlineIcon,
} from "chakra-ui-ionicons";
import { FC, useState } from "react";

const MenuItemSpinner: FC = () => <Spinner size="sm" />;

const ItemQuickMenuItem: FC<
	MenuItemProps & {
		isLoading?: boolean;
		colorScheme?: ModeSensitiveColor;
	}
> = ({
	isLoading = false,
	colorScheme,
	children,
	onClick = () => {},
	...menuItemProps
}) => {
	const colorSchemeColor = useModeSensitiveColor(colorScheme ?? "blue");

	return (
		<MenuItem
			display="flex"
			alignItems="center"
			justifyContent="space-between"
			color={colorScheme !== undefined ? colorSchemeColor : undefined}
			onClick={withStoppedPropagation(onClick)}
			{...menuItemProps}
			isDisabled={isLoading || menuItemProps.isDisabled}
		>
			{children}
			{isLoading && <MenuItemSpinner />}
		</MenuItem>
	);
};

export type ItemQuickMenuButtonProps = MenuButtonProps & {
	item: Item;
};

const selectNumberOfCharacters = flow(selectCharacters, A.length);

type QuantityAdjustment = "add" | "remove";

export const ItemQuickMenuButton: FC<ItemQuickMenuButtonProps> = ({
	item,
	...menuButtonProps
}) => {
	const menuProps = useDisclosure();

	const { onOpenToEditEntityWithId: openItemEditDialog } =
		useEntityTiedDialogAtom(itemDialogAtom);

	const [adjustmentThatIsBeingProcessed, setAdjustmentThatIsBeingProcessed] =
		useState<QuantityAdjustment | null>(null);

	const numberOfCharacters = useInventoryStore(selectNumberOfCharacters, []);

	const { open: openItemDeleteConfirmation } = useNullableIdTargetingDialogAtom(
		standaloneItemDeleteConfirmDialogAtom
	);
	const { open: openItemGiveToDialog } = useNullableIdTargetingDialogAtom(
		standaloneItemGiveToDialogAtom
	);

	const itemEditMutation = useEditItemMutation();

	const onAdjustQuantity = (adjustmentType: QuantityAdjustment) => {
		const adjustment = adjustmentType === "add" ? 1 : -1;
		setAdjustmentThatIsBeingProcessed(adjustmentType);
		return itemEditMutation
			.mutateAsync({
				itemId: item.id,
				data: {
					quantity: item.quantity + adjustment,
				},
			})
			.then(menuProps.onClose)
			.finally(() => setAdjustmentThatIsBeingProcessed(null));
	};

	return (
		<Menu isLazy {...menuProps}>
			<MenuButton
				data-testid="item-quick-menu-button"
				as={IconButton}
				icon={<EllipsisVerticalIcon />}
				aria-label={`open quick menu for ${item.name}`}
				size="sm"
				variant="ghost"
				isRound
				onClick={(e) => e.stopPropagation()}
				{...menuButtonProps}
			/>
			<MenuList>
				<ItemQuickMenuItem
					colorScheme="red"
					onClick={() => openItemDeleteConfirmation(item.id)}
					icon={<TrashOutlineIcon />}
				>
					Delete
				</ItemQuickMenuItem>

				<ItemQuickMenuItem
					onClick={() => openItemEditDialog(item.id)}
					icon={<PencilOutlineIcon />}
				>
					Edit
				</ItemQuickMenuItem>

				<ItemQuickMenuItem
					icon={<ExitOutlineIcon />}
					onClick={() => openItemGiveToDialog(item.id)}
					isDisabled={numberOfCharacters === 0}
				>
					Give To...
				</ItemQuickMenuItem>

				<MenuDivider />

				<MenuGroup>
					<ItemQuickMenuItem
						isLoading={adjustmentThatIsBeingProcessed === "remove"}
						isDisabled={itemEditMutation.isLoading || !item?.quantity}
						onClick={() => onAdjustQuantity("remove")}
						closeOnSelect={false}
						icon={<RemoveOutlineIcon />}
					>
						Remove 1
					</ItemQuickMenuItem>
					<ItemQuickMenuItem
						isLoading={adjustmentThatIsBeingProcessed === "add"}
						isDisabled={itemEditMutation.isLoading}
						onClick={() => onAdjustQuantity("add")}
						closeOnSelect={false}
						icon={<AddOutlineIcon />}
					>
						Add 1
					</ItemQuickMenuItem>
				</MenuGroup>
			</MenuList>
		</Menu>
	);
};

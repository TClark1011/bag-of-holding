import { useInventoryStoreDispatch } from "$sheets/store";
import { FilterableItemProperty } from "$sheets/types";
import { Button, ButtonGroup, ButtonProps, StyleProps } from "@chakra-ui/react";
import { FC } from "react";

type ButtonSize = Extract<ButtonProps["size"], string>;

export type FilterInterfaceActionsProps = StyleProps & {
	size?: ButtonSize;
	property: FilterableItemProperty;
	buttonProps?: ButtonProps;
};

const FilterInterfaceActions: FC<FilterInterfaceActionsProps> = ({
	size,
	property,
	buttonProps = {},
	...styleProps
}) => {
	const dispatch = useInventoryStoreDispatch();

	const onCheckAll = () => {
		dispatch({
			type: "ui.reset-filter",
			payload: property,
		});
	};

	const onUncheckAll = () => {
		dispatch({
			type: "ui.clear-filter",
			payload: property,
		});
	};

	const onInvert = () => {
		dispatch({
			type: "ui.invert-filter",
			payload: property,
		});
	};

	return (
		<ButtonGroup size={size} isAttached {...styleProps}>
			<Button {...buttonProps} onClick={onUncheckAll}>
				Uncheck All
			</Button>
			<Button {...buttonProps} onClick={onCheckAll}>
				Check All
			</Button>
			<Button {...buttonProps} onClick={onInvert}>
				Invert
			</Button>
		</ButtonGroup>
	);
};

export default FilterInterfaceActions;

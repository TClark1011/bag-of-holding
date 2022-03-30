import { FilterInterface } from "$sheets/components";
import { FilterableItemProperty } from "$sheets/types";
import {
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverProps,
	PopoverTrigger,
} from "@chakra-ui/react";

interface TableFilterProps extends PopoverProps {
	property: FilterableItemProperty;
}

/**
 * Popover containing the user interface for filtering
 * inventory table columns.
 *
 * @param props The props
 * @param props.property The
 * property that the filter is applied against
 * @param props.onChange Function to run whenever an
 * item is checked/unchecked. The text value of the changed
 * item is passed as a parameter.
 * @param props.filter An array of strings that are
 * currently being filtered out of the table.
 * @param props.children The children are
 * inserted into 'PopoverTrigger'. NOTE: While this does allow
 * the popover to automatically handle 'isOpen' and 'onClose'
 * properties, these props should still be supplied when this
 * component is used. This is because the state change triggered
 * by changing the filters will cause the Popover to close if
 * it's state is being handled automatically via the PopoverTrigger.
 * @returns Component stuff
 */
const TableFilter: React.FC<TableFilterProps> = ({
	property,
	children,
	...props
}) => {
	return (
		<Popover {...props} returnFocusOnClose>
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverBody>
					<FilterInterface property={property} />
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export default TableFilter;

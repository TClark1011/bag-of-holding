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
import { PropsWithChildren } from "react";

type TableFilterProps = PropsWithChildren &
	PopoverProps & {
		property: FilterableItemProperty;
		heading?: string;
	};

/**
 * Popover containing the user interface for filtering
 * inventory table columns.
 *
 * @param props.property The
 * property that the filter is applied against
 * @param props.onChange Function to run whenever an
 * item is checked/unchecked. The text value of the changed
 * item is passed as a parameter.
 * @param props.filter An array of strings that are
 * currently being filtered out of the table.
 * @param props.heading Heading to override the default that is
 * derived from the property
 */
const TableFilter: React.FC<TableFilterProps> = ({
	property,
	children,
	heading,
	...props
}) => {
	return (
		<Popover {...props} returnFocusOnClose>
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverBody>
					<FilterInterface heading={heading} property={property} />
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export default TableFilter;

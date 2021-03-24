import { Checkbox } from "@chakra-ui/checkbox";
import { Flex, Text } from "@chakra-ui/layout";
import {
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverProps,
	PopoverTrigger,
} from "@chakra-ui/popover";
import InventoryItemFields, {
	ProcessableItemProperty,
} from "../../types/InventoryItemFields";

interface TableFilterProps extends PopoverProps {
	property: ProcessableItemProperty;
	items: InventoryItemFields[];
	filter: string[];
	onChange: (item: string) => void;
}

/**
 * Popover containing the user interface for filtering
 * inventory table columns.
 *
 * @param {TableFilterProps} props The props
 * @param {ProcessableItemProperty} props.property The
 * property that the filter is applied against
 * @param {Function} props.onChange Function to run whenever an
 * item is checked/unchecked. The text value of the changed
 * item is passed as a parameter.
 * @param {string[]} props.filter An array of strings that are
 * currently being filtered out of the table.
 * @param {React.ReactElement} props.children The children are
 * inserted into 'PopoverTrigger'. NOTE: While this does allow
 * the popover to automatically handle 'isOpen' and 'onClose'
 * properties, these props should still be supplied when this
 * component is used. This is because the state change triggered
 * by changing the filters will cause the Popover to close if
 * it's state is being handled automatically via the PopoverTrigger.
 * @returns {React.ReactElement} Component stuff
 */
const TableFilter: React.FC<TableFilterProps> = ({
	property,
	items,
	onChange,
	filter,
	children,
	...props
}) => {
	const values = items.map((item) => item[property] + "");
	const uniqueValues = values
		.filter((item, index) => values.indexOf(item) === index)
		.sort();

	//TODO: "none" and "all" buttons

	return (
		<Popover {...props} returnFocusOnClose>
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverCloseButton />
				<PopoverBody>
					{uniqueValues.map((item) => (
						<Flex key={item}>
							<Checkbox
								isChecked={!filter.includes(item)}
								onChange={() => onChange(item)}
								marginRight="group"
							/>
							<Text>{item}</Text>
						</Flex>
					))}
				</PopoverBody>
			</PopoverContent>
		</Popover>
	);
};

export default TableFilter;

import { Button } from "@chakra-ui/button";
import { Checkbox } from "@chakra-ui/checkbox";
import { Flex, HStack, Text } from "@chakra-ui/layout";
import {
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverProps,
	PopoverTrigger,
} from "@chakra-ui/popover";
import { FilterSharpIcon } from "chakra-ui-ionicons";
import InventoryItemFields, {
	ProcessableItemProperty,
} from "../../types/InventoryItemFields";
import sort from "fast-sort";

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
	const propertyValues = items.map((item) => item[property] + "");
	const uniquePropertyValues = sort(
		propertyValues.filter(
			(item, index) => propertyValues.indexOf(item) === index
		)
	).asc();

	/**
	 * Remove all items from filter
	 * Iterates through all unique property values that are
	 * currently being filtered out and executes 'onChange'
	 * on them. It is assumed that 'onChange' toggles the
	 * filtering of the passed string.
	 */
	const resetFilter = () => {
		uniquePropertyValues
			.filter((item) => filter.includes(item))
			.forEach((item) => {
				onChange(item);
			});
	};

	/**
	 * Filter out all values
	 */
	const filterAll = () => {
		uniquePropertyValues
			.filter((item) => !filter.includes(item))
			.forEach((item) => {
				onChange(item);
			});
	};

	/**
	 * Invert current filter
	 */
	const invertFilter = () => {
		uniquePropertyValues.forEach((item) => {
			onChange(item);
		});
	};

	//TODO: "none" and "all" buttons

	return (
		<Popover {...props} returnFocusOnClose>
			<PopoverTrigger>{children}</PopoverTrigger>
			<PopoverContent>
				<PopoverArrow />
				<PopoverCloseButton />
				<PopoverBody>
					<Flex justify="flex-end" paddingRight="break">
						<HStack spacing="group">
							<Button size="xs" onClick={filterAll}>
								Uncheck All
							</Button>
							<Button size="xs" onClick={resetFilter}>
								Check All
							</Button>
							<Button size="xs" onClick={invertFilter}>
								Invert
							</Button>
						</HStack>
					</Flex>
					{uniquePropertyValues.map((item) => (
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

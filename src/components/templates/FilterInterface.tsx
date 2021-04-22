import { Box, BoxProps, Flex, List, ListItem, Text } from "@chakra-ui/layout";
import { FilterableItemProperty } from "../../types/InventoryItemFields";
import { useInventoryState } from "../contexts/InventoryStateContext";
import sort from "fast-sort";
import codeToTitle from "code-to-title";
import { Checkbox } from "@chakra-ui/checkbox";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { useSheetPageState } from "../../state/sheetPageState";

interface Props extends Omit<BoxProps, "onChange"> {
	property: FilterableItemProperty;
	heading?: string;
}

/**
 * The interface for a filter, containing the checkboxes for
 * all unique values and a header.
 *
 * @param {object} props The props
 * @param {FilterableItemProperty} props.property The property to filter
 * @param {string} [props.heading] The heading of the interface. If
 * not supplied, defaults to formatted version of the property string
 * @param {string[]} props.filter The filters currently being applied
 * @param {Function} props.onChange Callback to run when the filter is changed
 * @returns {React.ReactElement} Component stuff
 */
const FilterInterface: React.FC<Props> = ({
	property,
	heading = codeToTitle(property),
	...props
}) => {
	//FIXME: Opening a filter popover, changing some values, then clicking the 'Filters' button exceeds maximum callstack.
	const { items } = useInventoryState();

	const propertyValues = items.map((item) => item[property] + "");
	const uniquePropertyValues = sort(
		propertyValues.filter(
			(item, index) => propertyValues.indexOf(item) === index
		)
	).asc();

	const { updateFilter, resetPropertyFilter, filters } = useSheetPageState();

	const filter = filters[property];

	/**
	 * Callback to be executed when a filter is changed.
	 * Executes 'updateFilter', providing the property
	 *
	 * @param {string} value The value to pass to the filter
	 */
	const onChange = (value: string) => {
		updateFilter(property, value);
	};

	/**
	 * Reset filter. Runs the 'resetPropertyFilter' method for
	 * sheetPageState, providing the property
	 */
	const resetFilter = () => {
		resetPropertyFilter(property);
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

	const headingColor = useColorModeValue("gray.700", "white");

	return (
		<Box {...props}>
			<Flex
				borderBottom="1px"
				borderColor={headingColor}
				marginBottom="group"
				justify="space-between"
				alignItems="center"
				paddingBottom={1}
			>
				<Text color={headingColor} fontWeight="bold">
					{heading}
				</Text>
				<ButtonGroup size="xs" isAttached>
					<Button onClick={filterAll}>Uncheck All</Button>
					<Button onClick={resetFilter}>Check All</Button>
					<Button onClick={invertFilter}>Invert</Button>
				</ButtonGroup>
			</Flex>
			<List textAlign="left">
				{uniquePropertyValues.map((item) => (
					<ListItem key={item} display="flex" alignItems="center">
						<Checkbox
							marginRight="group"
							isChecked={!filter.includes(item)}
							onChange={() => onChange(item)}
						/>
						{item}
					</ListItem>
				))}
			</List>
		</Box>
	);
};

export default FilterInterface;

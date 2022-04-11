import {
	Box,
	BoxProps,
	Flex,
	List,
	ListItem,
	Text,
	Checkbox,
	Button,
	ButtonGroup,
	useColorModeValue,
} from "@chakra-ui/react";
import { FilterableItemProperty } from "$sheets/types";
import { useInventoryState } from "$sheets/providers";
import { sort } from "fast-sort";
import codeToTitle from "code-to-title";
import { PartyMemberData } from "$sheets/components";
import { useSheetPageState } from "$sheets/store";

interface Props extends Omit<BoxProps, "onChange"> {
	property: FilterableItemProperty;
	heading?: string;
}

/**
 * The interface for a filter, containing the checkboxes for
 * all unique values and a header.
 *
 * @param props The props
 * @param props.property The property to filter
 * @param [props.heading] The heading of the interface. If
 * not supplied, defaults to formatted version of the property string
 * @param props.filter The filters currently being applied
 * @param props.onChange Callback to run when the filter is changed
 * @returns Component stuff
 */
const FilterInterface: React.FC<Props> = ({
	property,
	heading = codeToTitle(property),
	...props
}) => {
	//POSSIBLE ERROR: Opening a filter popover, changing some values, then clicking the 'Filters' button exceeds maximum callstack.
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
	 * @param value The value to pass to the filter
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
							isChecked={!filter.includes(item)}
							onChange={() => onChange(item)}
						>
							<PartyMemberData memberId={item} property="name" fontSize="xs" />
						</Checkbox>
					</ListItem>
				))}
			</List>
		</Box>
	);
};

export default FilterInterface;

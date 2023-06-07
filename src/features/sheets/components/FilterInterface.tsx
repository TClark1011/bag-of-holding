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
import {
	selectEffectivePropertyFilter,
	selectAllPossibleFilterValuesOnProperty,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import { FilterableItemProperty } from "$sheets/types";
import EntityData from "$sheets/components/EntityData";
import { A, flow, G } from "@mobily/ts-belt";

interface Props extends Omit<BoxProps, "onChange"> {
	property: FilterableItemProperty;
	heading: string;
}

const sortNullToStart = (arr: (string | null)[]) =>
	A.sortBy(arr, G.isNot(G.isNull));

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
const FilterInterface: React.FC<Props> = ({ property, heading, ...props }) => {
	const dispatch = useInventoryStoreDispatch();
	const uniquePropertyValues = useInventoryStore(
		flow(selectAllPossibleFilterValuesOnProperty(property), sortNullToStart)
	);
	const filter = useInventoryStore(selectEffectivePropertyFilter(property));

	const onChange = (value: string | null) => {
		dispatch({
			type: "ui.toggle-filter",
			payload: {
				property,
				value,
			},
		});
	};

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
					<Button onClick={onUncheckAll}>Uncheck All</Button>
					<Button onClick={onCheckAll}>Check All</Button>
					<Button onClick={onInvert}>Invert</Button>
				</ButtonGroup>
			</Flex>
			<List textAlign="left">
				{uniquePropertyValues.map((propertyValue) => (
					<ListItem key={propertyValue} display="flex" alignItems="center">
						<Checkbox
							isChecked={filter.includes(propertyValue)}
							onChange={() => onChange(propertyValue)}
							sx={{
								"*": {
									fontSize: "xs",
								},
							}}
						>
							{property === "carriedByCharacterId" && (
								<EntityData
									entityType="characters"
									selector={(v) => v?.name ?? "Nobody"}
									entityId={propertyValue ?? ""}
								/>
							)}
							{property === "category" && <Box>{propertyValue || "None"}</Box>}
						</Checkbox>
					</ListItem>
				))}
			</List>
		</Box>
	);
};

export default FilterInterface;

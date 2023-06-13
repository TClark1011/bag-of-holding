import {
	Box,
	BoxProps,
	Flex,
	List,
	ListItem,
	Text,
	Checkbox,
	useColorModeValue,
} from "@chakra-ui/react";
import {
	composeSelectEffectivePropertyFilter,
	composeSelectAllPossibleFilterValuesOnProperty,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import { FilterableItemProperty } from "$sheets/types";
import EntityData from "$sheets/components/EntityData";
import { A, flow, G } from "@mobily/ts-belt";
import FilterInterfaceActions from "$sheets/components/FilterInterfaceActions";

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
		flow(
			composeSelectAllPossibleFilterValuesOnProperty(property),
			sortNullToStart
		),
		[property]
	);
	const filter = useInventoryStore(
		composeSelectEffectivePropertyFilter(property),
		[property]
	);

	const onChange = (value: string | null) => {
		dispatch({
			type: "ui.toggle-filter",
			payload: {
				property,
				value,
			},
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
				<FilterInterfaceActions property={property} size="xs" />
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

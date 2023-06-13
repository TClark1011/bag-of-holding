import { get } from "$fp";
import { useRenderLogging } from "$root/hooks";
import EntityData from "$sheets/components/EntityData";
import FilterInterfaceActions from "$sheets/components/FilterInterfaceActions";
import {
	composeSelectAllPossibleFilterValuesOnProperty,
	composeSelectEffectivePropertyFilter,
	useInventoryStore,
	useInventoryStoreDispatch,
} from "$sheets/store";
import { FilterableItemProperty } from "$sheets/types";
import {
	Checkbox,
	Flex,
	SimpleGrid,
	StyleProps,
	Text,
	VStack,
} from "@chakra-ui/react";
import { A, D, G, O, flow, pipe } from "@mobily/ts-belt";
import { FC } from "react";

export type BigFilterInterfaceProps = StyleProps & {
	property: FilterableItemProperty;
	heading: string;
	hideIfEmpty?: boolean;
};

/**
 * This is used in the mobile version of the filter dialog
 * and uses larger UI for better usability on touch screens
 */
const BigFilterInterface: FC<BigFilterInterfaceProps> = ({
	property,
	heading,
	hideIfEmpty = false,
	...styleProps
}) => {
	useRenderLogging("BigFilterInterface", [property]);

	const dispatch = useInventoryStoreDispatch();

	const values = useInventoryStore(
		composeSelectAllPossibleFilterValuesOnProperty(property),
		[property]
	);
	const effectiveItemFilter = useInventoryStore(
		composeSelectEffectivePropertyFilter(property),
		[property]
	);

	if (hideIfEmpty && pipe(values, A.reject(G.isNull), A.isEmpty)) {
		return null;
	}

	return (
		<VStack
			align="flex-start"
			sx={{
				"& > * ": {
					w: "full",
				},
			}}
			w="full"
			{...styleProps}
		>
			<Flex
				justify="space-between"
				align="center"
				borderBottomWidth="thin"
				borderBottomColor="gray.400"
				py={1}
			>
				<Text fontSize="xl">{heading}</Text>
			</Flex>
			<FilterInterfaceActions
				buttonProps={{
					flexBasis: "33.3%",
				}}
				w="full"
				property={property}
			/>
			<SimpleGrid columns={2} gap={2}>
				{values.map((value) => (
					<Checkbox
						w="full"
						borderWidth="thin"
						borderColor="ActiveBorder"
						_hover={{
							background: "shade.100",
						}}
						p={2}
						rounded="md"
						size="lg"
						key={value}
						isChecked={effectiveItemFilter.includes(value)}
						onChange={() =>
							dispatch({
								type: "ui.toggle-filter",
								payload: {
									property,
									value,
								},
							})
						}
					>
						<Text>
							{property === "carriedByCharacterId" && (
								<EntityData
									entityType="characters"
									selector={flow(
										O.fromNullable,
										O.map(get("name")),
										O.getWithDefault<string>("Nobody")
									)}
									entityId={value ?? ""}
								/>
							)}
							{property === "category" && (value ?? "None")}
						</Text>
					</Checkbox>
				))}
			</SimpleGrid>
		</VStack>
	);
};

export default BigFilterInterface;

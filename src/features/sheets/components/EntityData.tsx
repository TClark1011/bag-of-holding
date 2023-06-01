import { FullSheetEntityProperty, GetEntityByProperty } from "$extra-schemas";
import { selectEntityWithId, useInventoryStore } from "$sheets/store";
import { Box, BoxProps } from "@chakra-ui/react";
import { flow } from "@mobily/ts-belt";
import { FC, useMemo } from "react";

export type EntityDataProps<EntityName extends FullSheetEntityProperty> =
	BoxProps & {
		entityType: EntityName;
		selector: (
			entity: GetEntityByProperty<EntityName> | undefined
		) => ReturnType<FC> | string;
		entityId: string;
	};

/**
 * Display data from an entity (either an Item or Character). Takes
 * the id of the target entity and looks it up in the store.
 *
 * @param props The props
 * @param props.entityType The type of entity to display
 * @param props.selector Select the data of the entity to display
 * @param props.entityId The id of the entity to display data from
 */
const EntityData = <EntityName extends FullSheetEntityProperty>({
	entityType,
	selector,
	entityId,
	...boxProps
}: EntityDataProps<EntityName>) => {
	const memoisedSelector = useMemo(
		() => flow(selectEntityWithId(entityId, entityType), selector),
		[entityId, selector]
	);
	const data = useInventoryStore(memoisedSelector);

	return <Box {...boxProps}>{data}</Box>;
};

export default EntityData;

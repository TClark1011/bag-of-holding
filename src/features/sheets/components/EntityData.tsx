import { FullSheetEntityProperty, GetEntityByProperty } from "$sheets/types";
import { composeSelectEntityWithId, useInventoryStore } from "$sheets/store";
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
 * Display the data from an entity in the inventory, eg;
 * an Item or a Character.
 */
const EntityData = <EntityName extends FullSheetEntityProperty>({
	entityType,
	selector,
	entityId,
	...boxProps
}: EntityDataProps<EntityName>) => {
	const memoisedSelector = useMemo(
		() => flow(composeSelectEntityWithId(entityId, entityType), selector),
		[entityId, selector]
	);
	const data = useInventoryStore(memoisedSelector);

	return <Box {...boxProps}>{data}</Box>;
};

export default EntityData;

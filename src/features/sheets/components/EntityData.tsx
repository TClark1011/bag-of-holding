import { FullSheetEntityProperty, GetEntityByProperty } from "$sheets/types";
import { composeSelectEntityWithId, useInventoryStore } from "$sheets/store";
import { Box, BoxProps } from "@chakra-ui/react";
import { flow } from "@mobily/ts-belt";
import { FC } from "react";

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
 *
 *
 * @param props The props
 * @param props.selector A function that extracts data from
 * the entity with the passed id. NOTE: It is very important
 * that this selector is "stable", which means it either needs
 * to be defined outside of a component, or if defined inside
 * a component it must be memoised with either `useCallback`
 * or `useMemo`. If you don't this then this component may not
 * re-render when the entity it is pulling from changes.
 */
const EntityData = <EntityName extends FullSheetEntityProperty>({
	entityType,
	selector,
	entityId,
	...boxProps
}: EntityDataProps<EntityName>) => {
	const data = useInventoryStore(
		flow(composeSelectEntityWithId(entityId, entityType), selector),
		[entityType, entityId, selector]
	);

	return <Box {...boxProps}>{data}</Box>;
};

export default EntityData;

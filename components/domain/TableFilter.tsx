import { Checkbox } from "@chakra-ui/checkbox";
import { Flex, Text } from "@chakra-ui/layout";
import {
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverCloseButton,
	PopoverContent,
	PopoverHeader,
	PopoverProps,
	PopoverTrigger,
} from "@chakra-ui/popover";
import { useMemo } from "react";
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
 *
 */
const TableFilter: React.FC<TableFilterProps> = ({
	property,
	items,
	children,
	onChange,
	filter,
	...props
}) => {
	const values = items.map((item) => item[property] + "");
	const uniqueValues = values
		.filter((item, index) => values.indexOf(item) === index)
		.sort();

	return (
		<Popover {...props}>
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

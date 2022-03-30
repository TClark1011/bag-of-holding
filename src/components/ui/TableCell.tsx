import { TableCellProps, Td } from "@chakra-ui/react";

/**
 * A component to be used as a table cell
 *
 * @param props TableCell props
 * @returns Rendered stuff
 */
const TableCell: React.FC<TableCellProps> = (props) => (
	<Td paddingX={2} textAlign="center" {...props} />
);

export default TableCell;

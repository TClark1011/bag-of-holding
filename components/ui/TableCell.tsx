import { TableCellProps, Td } from "@chakra-ui/table";

/**
 * A component to be used as a table cell
 *
 * @param {chakra.TableCellProps} props TableCell props
 * @returns {React.ReactElement} Rendered stuff
 */
const TableCell: React.FC<TableCellProps> = (props) => (
	<Td paddingX={2} textAlign="center" {...props} />
);

export default TableCell;

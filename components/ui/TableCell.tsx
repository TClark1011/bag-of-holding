import { TableCellProps, Td } from "@chakra-ui/table";

/**
 * @param props
 */
const TableCell: React.FC<TableCellProps> = (props) => (
	<Td paddingX={2} textAlign="center" {...props} />
);

export default TableCell;

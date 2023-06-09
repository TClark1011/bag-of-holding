import { useBreakpointValue } from "@chakra-ui/react";

export type BreakpointVisibleColumns = 3 | 4 | 5 | 6;

/**
 * We show less columns on smaller screens. As well as in the table
 * itself, we need to adapt to this in other parts of the UI, which
 * is why we extracted it to it's own hook.
 */
const useBreakpointVisibleColumns = (): BreakpointVisibleColumns =>
	useBreakpointValue({
		base: 3,
		sm: 4,
		md: 5,
		lg: 6,
	}) ?? 3;

export const useAllColumnsAreVisible = (): boolean =>
	useBreakpointVisibleColumns() >= 6;

export default useBreakpointVisibleColumns;

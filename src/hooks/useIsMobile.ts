import { useBreakpointValue, ResponsiveObject } from "@chakra-ui/react";

export const composeMobileConditionalResponsiveValue = <T>(
	ifMobile: T,
	ifNotMobile: T
): ResponsiveObject<T> => ({
	base: ifMobile,
	md: ifNotMobile,
});

const useIsMobile = (): boolean =>
	useBreakpointValue(composeMobileConditionalResponsiveValue(true, false)) ??
	false;

export default useIsMobile;

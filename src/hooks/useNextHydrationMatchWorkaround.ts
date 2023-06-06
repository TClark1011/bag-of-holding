import { useEffect, useState } from "react";

/**
 * If you are using some kind of client-only state management,
 * (eg; localStorage), then Next will likely throw an error
 * due to the client-side value not matching the server-side.
 * You can use this hook to work around that by only showing
 * the real value once the hydration has completed.
 */
const useNextHydrationMatchWorkaround = <T>(
	actualValue: T,
	fallbackValue: T
): T => {
	const [value, setValue] = useState<T>(fallbackValue);

	useEffect(() => {
		setValue(actualValue);
	}, [actualValue]);

	return value;
};

export default useNextHydrationMatchWorkaround;

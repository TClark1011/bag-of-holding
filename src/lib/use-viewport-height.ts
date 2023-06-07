/**
 * Credit: mvasin
 * This code was copied from here (https://github.com/mvasin/react-div-100vh/) for
 * the purpose of cutting down on dependencies. It's MIT licensed.
 */

import { useEffect, useState } from "react";

// Once we ended up on the client, the first render must look the same as on
// the server so hydration happens without problems. _Then_ we immediately
// schedule a subsequent update and return the height measured on the client.
// It's not needed for CSR-only apps, but is critical for SSR.
const useWasRenderedOnClientAtLeastOnce = () => {
	const [wasRenderedOnClientAtLeastOnce, setWasRenderedOnClientAtLeastOnce] =
		useState(false);

	useEffect(() => {
		if (isClient()) {
			setWasRenderedOnClientAtLeastOnce(true);
		}
	}, []);

	return wasRenderedOnClientAtLeastOnce;
};

const isClient = () =>
	typeof window !== "undefined" && typeof document !== "undefined";

const measureHeight = (): number | null =>
	isClient() ? window.innerHeight : null;

const useViewportHeight = (): number | null => {
	const [height, setHeight] = useState<number | null>(measureHeight);

	const wasRenderedOnClientAtLeastOnce = useWasRenderedOnClientAtLeastOnce();

	useEffect(() => {
		if (!wasRenderedOnClientAtLeastOnce) return;

		const updateMeasuredHeight = () => {
			setHeight(measureHeight());
		};

		window.addEventListener("resize", updateMeasuredHeight);
		return () => window.removeEventListener("resize", updateMeasuredHeight);
	}, [wasRenderedOnClientAtLeastOnce]);

	return wasRenderedOnClientAtLeastOnce ? height : null;
};

export default useViewportHeight;

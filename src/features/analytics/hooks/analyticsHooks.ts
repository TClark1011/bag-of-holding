import { useAnalyticsState } from "$analytics/store";
import { logPageView, logException, logEvent } from "$analytics/utils";
import { AnalyticsPageViewProps } from "$analytics/types";
import { ReactEffect } from "$root/types";
import { useEffect } from "react";

/**
 * Use an effect that is dependant on analytics being
 * initialised, eg; a page view event
 *
 * @param [effect] The effect to run, if analytics are not
 * initialised, they will be initialised and then the
 * effect will run. If no effect is provided, then all that
 * will happen is that the analytics will be initialised if
 * they are not already.
 * @param [deps] The dependencies for the effect,
 * if any of these change, the effect will re-run.
 */
export const useAnalyticsEffect = (
	effect: ReactEffect = () => {},
	deps: any[] = []
) => {
	const { initialized, markAsInitialized } = useAnalyticsState();

	useEffect(() => {
		if (!initialized) {
			markAsInitialized();
		}
	}, []);

	useEffect(() => {
		if (initialized) {
			return effect();
		}
	}, [initialized, ...deps]);
};

export type UseAnalyticsPageViewOptions = AnalyticsPageViewProps & {
	shouldLogPageView?: boolean;
};

/**
 * Log a Page View with analytics.
 * Will only execute on component mount.
 *
 * @param [pageViewProps] The props to pass to
 * 'logPageView'
 * @param pageViewProps.shouldLogPageView Whether or not the
 * pageView should be logged. Allows for this hook to be used
 * conditionally.
 */
export const useAnalyticsPageView = ({
	shouldLogPageView = true,
	...pageViewProps
}: UseAnalyticsPageViewOptions): void => {
	useAnalyticsEffect(() => {
		if (shouldLogPageView) {
			logPageView(pageViewProps);
		}
	}, []);
};

/**
 * Get a function to log an analytics event. If
 * analytics will be initialised if they have not
 * already been.
 *
 * @returns a function to log an analytics event
 */
export const useAnalyticsEventLogger = () => {
	useAnalyticsEffect();
	return logEvent;
};

/**
 * Get a function to log an analytics exception,
 * makes sure analytics are initialised first.
 *
 * @returns a function to log an analytics exception
 */
export const useAnalyticsExceptionLogger = () => {
	useAnalyticsEffect();
	return logException;
};

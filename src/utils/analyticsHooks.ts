import {
	DEBUG_ANALYTICS,
	GOOGLE_ANALYTICS_ID,
	inTesting,
} from "../config/publicEnv";
import { useHookstate, createState as createHookstate } from "@hookstate/core";
import { useEffect } from "react";
import GoogleAnalytics from "react-ga";
import stringifyObject from "stringify-object";

export interface AnalyticsPageViewProps {
	url?: string;
	title?: string;
}

/**
 * Log a page view in Google Analytics
 *
 * @param {object} pageViewProps Props to pass to the analytics
 * page view event
 * @param {string} [pageViewProps.url] The url of the
 * page. If not provided, use `window.location.pathname`
 * @param {string} [pageViewProps.title] The title of the
 * page. If not provided, uses `document.title`
 */
export const logPageView = ({
	url,
	title,
}: AnalyticsPageViewProps = {}): void => {
	try {
		const location = url || window.location.pathname;
		GoogleAnalytics.set({ page: location });
		console.log("(analyticsHooks) title: ", title);
		if (title) {
			GoogleAnalytics.pageview(location, [], title);
		} else {
			GoogleAnalytics.pageview(location);
		}
	} catch (e) {
		-1;
	}
};

/**
 * Log an exception in analytics
 *
 * @param {string} description A description of the exception
 * @param {object} [optionalProps] Extra props that can be
 * optionally provided
 * @param {false} [optionalProps.fatal=false] Whether or not
 * the exception was fatal
 * @param {string} [optionalProps.extraData] Extra data that can
 * be provided to give extra context
 */
export const logException = (
	description: string,
	{ fatal = false, extraData }: { fatal?: boolean; extraData?: string }
): void => {
	GoogleAnalytics.exception({
		description,
		fatal,
		...(extraData && { extraData: stringifyObject(extraData) }),
	});
};

export type AnalyticsEventCategory = "Sheet";

/**
 * Log an event in Google Analytics
 *
 * @param {string} category The category of the event
 * @param {string} action The action of the event
 */
export const logEvent = (
	category: AnalyticsEventCategory,
	action: string
): void => {
	GoogleAnalytics.event({ category, action });
};

/**
 * State object to check if analytics have been initialised
 */
export const analyticsInitialisedState = createHookstate<boolean>(false);

/**
 * A hook for checking the status of analytics reporting
 *
 * @returns {boolean} Whether or not analytics have been
 * initialised
 */
export const useAnalyticsInitStatus = (): boolean =>
	useHookstate(analyticsInitialisedState).value;

/**
 * Initialises analytics if not already initialised
 */
export const useAnalyticsInit = (): void => {
	const analyticsInitialised = useHookstate(analyticsInitialisedState);

	if (!analyticsInitialised.value) {
		GoogleAnalytics.initialize(GOOGLE_ANALYTICS_ID, {
			debug: DEBUG_ANALYTICS,
			testMode: inTesting,
		});
		analyticsInitialised.set(true);
	}
};

/**
 * Log a Page View with analytics.
 * Will only execute on component mount.
 *
 * @param {object} [pageViewProps] The props to pass to
 * 'logPageView'
 */
export const useAnalyticsPageView: typeof logPageView = (pageViewProps) => {
	useAnalyticsInit();
	useEffect(() => {
		logPageView(pageViewProps);
	}, []);
};

/**
 * Return a function to log an analytics event.
 *
 * @returns {Function} a function to log an
 * analytics event
 */
export const useAnalyticsEvent = (): typeof logEvent => {
	useAnalyticsInit();
	return logEvent;
};

/**
 * Return a function to log an analytics exception.
 *
 * @returns {Function} a function to log an
 * analytics exception
 */
export const useAnalyticsException = (): typeof logException => {
	useAnalyticsInit();
	return logException;
};

import {
	AnalyticsEventCategory,
	AnalyticsPageViewProps,
} from "$analytics/types";
import Analytics from "$analytics";
import stringifyObject from "stringify-object";

/**
 * Log a page view in Google Analytics
 *
 * @param pageViewProps Props to pass to the analytics
 * page view event
 * @param [pageViewProps.url] The url of the
 * page. If not provided, use `window.location.pathname`
 * @param [pageViewProps.title] The title of the
 * page. If not provided, uses `document.title`
 */
export const logPageView = ({
	url,
	title,
}: AnalyticsPageViewProps = {}): void => {
	try {
		const location = url || window.location.pathname;
		Analytics.set({ page: location });
		console.log("(analyticsHooks) title: ", title);
		if (title) {
			Analytics.pageview(location, [], title);
		} else {
			Analytics.pageview(location);
		}
	} catch (e) {
		-1;
	}
};

/**
 * Log an exception in analytics
 *
 * @param description A description of the exception
 * @param [optionalProps] Extra props that can be
 * optionally provided
 * @param [optionalProps.fatal=false] Whether or not
 * the exception was fatal
 * @param [optionalProps.extraData] Extra data that can
 * be provided to give extra context
 */
export const logException = (
	description: string,
	{ fatal = false, extraData }: { fatal?: boolean; extraData?: string }
): void => {
	Analytics.exception({
		description,
		fatal,
		...(extraData && { extraData: stringifyObject(extraData) }),
	});
};

/**
 * Log an event in Google Analytics
 *
 * @param category The category of the event
 * @param action The action of the event
 */
export const logEvent = (
	category: AnalyticsEventCategory,
	action: string
): void => {
	Analytics.event({ category, action });
};

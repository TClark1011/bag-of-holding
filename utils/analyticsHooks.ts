import { GOOGLE_ANALYTICS_ID } from "./../config/publicEnv";
import { useHookstate, createState as createHookstate } from "@hookstate/core";
import { useEffect } from "react";
import GoogleAnalytics from "react-ga";
import blockProdBuild from "./blockProdBuild";

blockProdBuild("Confirm that google analytics is working");

/**
 * Log a page view in Google Analytics
 */
export const logPageView = (): void => {
	try {
		GoogleAnalytics.set({ page: window.location.pathname });
		GoogleAnalytics.pageview(window.location.pathname);
	} catch (e) {
		-1;
	}
};

/**
 * Log an event in Google Analytics
 *
 * @param {string} category The category of the event
 * @param {string} action The action of the event
 */
export const logEvent = (category: string, action: string): void => {
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

	if (!analyticsInitialised) {
		GoogleAnalytics.initialize(GOOGLE_ANALYTICS_ID);
		analyticsInitialised.set(true);
	}
};

/**
 * Log a Page View with analytics.
 * Will only execute on component mount.
 */
export const useAnalyticsPageView = (): void => {
	useAnalyticsInit();
	useEffect(() => {
		logPageView();
	}, []);
};

/**
 * Return a function to log an analytics event.
 *
 * @returns {Function} a function to log an
 * analytics event
 */
export const useAnalyticsEvent = (): ((p1: string, p2: string) => void) => {
	useAnalyticsInit();
	return (category, action) => {
		logEvent(category, action);
	};
};

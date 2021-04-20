import GoogleAnalytics from "react-ga";
import blockProdBuild from "./blockProdBuild";

blockProdBuild("Confirm that google analytics is working");

/**
 * Log a page view in Google Analytics
 */
export const logPageView = (): void => {
	GoogleAnalytics.set({ page: window.location.pathname });
	GoogleAnalytics.pageview(window.location.pathname);
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

import GoogleAnalytics from "react-ga";
import { createState as createHookstate, useHookstate } from "@hookstate/core";
import { GOOGLE_ANALYTICS_ID } from "../config/publicEnv";

export interface GlobalStoreFields {
	googleAnalyticsInitialised: boolean;
}

export const globalState = createHookstate<GlobalStoreFields>({
	googleAnalyticsInitialised: false,
});

/**
 * Global state store
 *
 * @returns {object} State values and actions
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useGlobalState = () => {
	const state = useHookstate(globalState);

	return {
		//# VALUES/SELECTORS
		googleAnalyticsInitialised: state.googleAnalyticsInitialised.value,

		//# ACTIONS
		/**
		 *
		 */
		initialiseGoogleAnalytics: () => {
			if (!state.googleAnalyticsInitialised.value) {
				GoogleAnalytics.initialize(GOOGLE_ANALYTICS_ID);
				state.googleAnalyticsInitialised.set(true);
			}
		},
	};
};

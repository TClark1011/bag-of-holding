import { createState, withSeparateActions } from "$zustand";

/**
 * Zustand state store for tracking the
 * initialization status of the analytics
 * controller
 */
const useAnalyticsState = createState(
	withSeparateActions(
		{
			initialized: false,
		},
		(set) => ({
			/**
			 * Mark initialized as true
			 */
			markAsInitialized: () => {
				set({
					initialized: true,
				});
			},
		})
	)
);

export default useAnalyticsState;

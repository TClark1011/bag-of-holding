import { createState, withSeparateActions } from "$zustand";

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

import { createState as createHookstate, useHookstate } from "@hookstate/core";

export interface NewSheetPageState {
	errorHasOccurred: boolean;
}

const newSheetPageState = createHookstate<NewSheetPageState>({
	errorHasOccurred: false,
});

/**
 * Hook to use the state values of the new sheet page
 *
 * @returns The values/selectors/actions for
 * the state
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useNewSheetPageState = () => {
	const state = useHookstate(newSheetPageState);
	return {
		//# SELECTORS
		errorHasOccurred: state.errorHasOccurred.value,

		//# ACTIONS
		/**
		 * Set 'error has occurred' to true
		 */
		turnOnError: () => {
			state.errorHasOccurred.set(true);
		},
	};
};

export default newSheetPageState;

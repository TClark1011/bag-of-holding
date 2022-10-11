import { useForm as useBaseForm } from "react-hook-form";

export * from "react-hook-form";

/**
 * A custom version of `useForm` with its `mode` set to `onChange` by
 * default
 *
 * @param options options to pass to `useForm`
 */
export const useForm: typeof useBaseForm = (options) =>
	useBaseForm({
		mode: "onBlur",
		...options,
	});

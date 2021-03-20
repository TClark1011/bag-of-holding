import {
	FormControl,
	FormControlProps,
	FormHelperText,
	FormLabel,
	FormLabelProps,
	HelpTextProps,
} from "@chakra-ui/form-control";

interface FormMetaElements extends FormControlProps {
	label?: string;
	labelProps?: FormLabelProps;
	helperText?: string;
	helperTextProps?: HelpTextProps;
}

/**
 * A component that provides the meta data related elements of a form
 * item within a form control.
 *
 * Allows for convenient use of form control + FormLabel + FormHelper text
 * without boilerplate.
 *
 * @param {object} props The props
 * @param {React.ReactElement} [props.children] The actual input element
 * @param {string} [props.label] The label to use
 * @param {FormLabelProps} [props.labelProps] The props to pass to the label
 * @param {string} [props.helperText] The helper text to use
 * @param {HelpTextProps} [props.helperTextProps] Props passed to 'FormHelperText' element
 * @returns {React.ReactElement} Rendered elements
 */
const FormMetaElements: React.FC<FormMetaElements> = ({
	children,
	label,
	labelProps = {},
	helperText,
	helperTextProps = {},
	...props
}) => (
	<FormControl {...props}>
		{label && <FormLabel {...labelProps}>{label}</FormLabel>}
		{children}
		{helperText && (
			<FormHelperText {...helperTextProps}>{helperText}</FormHelperText>
		)}
	</FormControl>
);

export default FormMetaElements;

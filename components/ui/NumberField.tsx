import {
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputProps,
	NumberInputStepper,
} from "@chakra-ui/number-input";

/**
 * @param props
 */
const NumberField: React.FC<Omit<NumberInputProps, "children">> = (props) => (
	<NumberInput {...props}>
		<NumberInputField />
		<NumberInputStepper>
			<NumberIncrementStepper />
			<NumberDecrementStepper />
		</NumberInputStepper>
	</NumberInput>
);

export default NumberField;

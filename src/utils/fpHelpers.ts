const MISSING_PARAMETER = Symbol("MISSING_PARAMETER");

export function guardedIfElse<Input, DesiredSubType extends Input, Output>(
	input: Input,
	guardCondition: (input: Input) => input is DesiredSubType,
	ifYes: (input: DesiredSubType) => Output,
	ifNo: (input: Exclude<Input, DesiredSubType>) => Output
): Output;
export function guardedIfElse<Input, DesiredSubType extends Input, Output>(
	guardCondition: (input: Input) => input is DesiredSubType,
	ifYes: (input: DesiredSubType) => Output,
	ifNo: (input: Exclude<Input, DesiredSubType>) => Output
): (input: Input) => Output;
/**
 * Like ts-belt's `F.ifElse`, except that the condition deriver
 * is a type guard, and the result of that type guard then changes
 * the type of the parameter received by the `ifYes` and `ifNo` functions
 *
 * @param params The same as `F.ifElse`, including currying configurations
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function guardedIfElse<Input, DesiredSubType extends Input, Output>(
	...params:
		| [
				Input,
				(input: Input) => input is DesiredSubType,
				(input: DesiredSubType) => Output,
				(input: Exclude<Input, DesiredSubType>) => Output
		  ]
		| [
				(input: Input) => input is DesiredSubType,
				(input: DesiredSubType) => Output,
				(input: Exclude<Input, DesiredSubType>) => Output
		  ]
) {
	const [optionalInput, guardCondition, ifYes, ifNo] =
		params.length === 4 ? params : ([MISSING_PARAMETER, ...params] as const);


	const implementation = (input: Input) => {
		if (guardCondition(input)) {
			return ifYes(input);
		}
		return ifNo(input as Exclude<Input, DesiredSubType>);
	};

	if (optionalInput === MISSING_PARAMETER) {
		return implementation;
	}
	return implementation(optionalInput);
}

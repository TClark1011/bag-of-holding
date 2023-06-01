import { A, O, pipe } from "@mobily/ts-belt";

export type LoopedProgression<T> = {
	readonly sequence: readonly T[];
	readonly currentIndex: number;
};

export const createLoopedProgression = <T>(
	sequence: readonly T[]
): LoopedProgression<T> => ({
	sequence,
	currentIndex: 0,
});

export const getLoopedProgressionValue = <T>(
	progression: LoopedProgression<T>
): T => progression.sequence[progression.currentIndex];

export const goNextOnLoopedProgression = <T>(
	progression: LoopedProgression<T>
): LoopedProgression<T> => {
	const nextIndex =
		(progression.currentIndex + 1) % progression.sequence.length;

	return {
		...progression,
		currentIndex: nextIndex,
	};
};

export const updateLoopedProgressionToPositionOfValue = <T>(
	progression: LoopedProgression<T>,
	value: T,
	equalityChecker: (a: T, b: T) => boolean = (a, b) => a === b
): LoopedProgression<T> => {
	const index = pipe(
		progression.sequence as T[],
		A.getIndexBy((item) => equalityChecker(item, value)),
		O.getWithDefault<number>(-1)
	);

	if (index === -1)
		throw new Error(
			`value (${JSON.stringify(value)}) not found in progression`
		);

	return {
		...progression,
		currentIndex: index,
	};
};

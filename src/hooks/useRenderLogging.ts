import { inDevelopment } from "$root/config";
import { useEffect, useRef } from "react";

const distributedSeededRandomNumber = (seed: string) => {
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = seed.charCodeAt(i) + ((hash << 5) - hash);
	}
	return hash;
};

const seededRandomColor = (seed: string) => {
	let color = Math.floor(
		Math.abs(Math.sin(distributedSeededRandomNumber(seed)) * 16777215)
	).toString(16);
	// pad any colors shorter than 6 characters with leading 0s
	while (color.length < 6) {
		color = "0" + color;
	}

	return ("#" + color).substring(0, 16);
};

const composeStyledConsoleLog = (stringStyleCombos: [string, string][]) => {
	const strings = stringStyleCombos.map(([string]) => string);
	const styles = stringStyleCombos.map(([, style]) => style);

	return ["%c⏺ " + strings.map((str) => `%c${str}`).join(""), "", ...styles];
};

const getLogPrinter =
	(componentName: string, extraContext: (string | number)[] = []) =>
	(extraMessage: string) => {
		const componentNameColor = seededRandomColor(componentName);
		if (inDevelopment) {
			console.debug(
				...composeStyledConsoleLog([
					[`[${componentName}`, `color: ${componentNameColor}`],
					...(extraContext.length > 0
						? ([[" (", "color: white;"]] as [string, string][])
						: []),
					...extraContext.map(
						(context, index) =>
							[
								`${context}${index !== extraContext.length - 1 ? "," : ""}`,
								`color: ${seededRandomColor(String(context))};`,
							] as [string, string]
					),
					...(extraContext.length > 0
						? ([[")", "color: white;"]] as [string, string][])
						: []),
					["] ", `color: ${componentNameColor}`],
					[extraMessage, "color: inherit;"],
				])
			);
		}
	};

/**
 * Print messages to the debug console when a component
 * renders/mounts/unmounts.
 *
 * @param componentName The name of the component
 * @param extraContext Any extra additional context to apply to
 * the component label (eg; if a component has multiple instances,
 * you can provided an ID to differentiate them)
 */
const useRenderLogging = (
	componentName: string,
	extraContext: (string | number)[] = []
) => {
	const renderCountRef = useRef(0);
	const loggerRef = useRef(getLogPrinter(componentName, extraContext));

	useEffect(() => {
		renderCountRef.current += 1;

		loggerRef.current(
			renderCountRef.current > 1
				? `rendered ${renderCountRef.current} times`
				: "mounted"
		);
	});

	useEffect(() => {
		const logger = loggerRef.current;
		return () => {
			if (renderCountRef.current > 1) {
				logger("unmounted");
			}
		};
	}, []);
};

export default useRenderLogging;

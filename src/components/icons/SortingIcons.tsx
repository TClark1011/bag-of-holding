import { createIcon } from "@chakra-ui/react";

export const NumericAscendingSortIcon = createIcon({
	displayName: "NumericAscendingSortIcon",
	viewBox: "0 0 24 24",
	path: <path fill="currentColor" d="M3 11H15V13H3M3 18V16H21V18M3 6H9V8H3Z" />,
});

export const NumericDescendingSortIcon = createIcon({
	displayName: "NumericDescendingSortIcon",
	viewBox: "0 0 24 24",
	path: (
		<path fill="currentColor" d="M3,13H15V11H3M3,6V8H21V6M3,18H9V16H3V18Z" />
	),
});

export const TextAscendingSortIcon = createIcon({
	displayName: "StringAscendingSortIcon",
	viewBox: "0 0 16 16",
	path: (
		<>
			<path
				fillRule="evenodd"
				fill="currentColor"
				d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z"
			/>
			<path
				fill="currentColor"
				d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z"
			/>
		</>
	),
});

export const TextDescendingSortIcon = createIcon({
	displayName: "StringDescendingSortIcon",
	viewBox: "0 0 16 16",
	path: (
		<>
			<path
				fill="currentColor"
				d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V7z"
			/>
			<path
				fill="currentColor"
				fillRule="evenodd"
				d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371h-1.781zm1.57-.785L11 9.688h-.047l-.652 2.156h1.351z"
			/>
			<path
				fill="currentColor"
				d="M4.5 13.5a.5.5 0 0 1-1 0V3.707L2.354 4.854a.5.5 0 1 1-.708-.708l2-1.999.007-.007a.498.498 0 0 1 .7.006l2 2a.5.5 0 1 1-.707.708L4.5 3.707V13.5z"
			/>
		</>
	),
});

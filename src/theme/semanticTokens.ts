import { DeepPartial } from "@chakra-ui/react";

type PrimitiveSemanticColorValue =
	| string
	| {
			default: string;
			_dark: string;
	  };

type Dictionary<T> = Record<string, T>;

type DictionaryOrType<T> = T | Dictionary<T>;

/**
 * Add to this as needed.
 */
type SemanticTokensListing = DeepPartial<{
	colors: Dictionary<DictionaryOrType<PrimitiveSemanticColorValue>>;
}>;

const semanticTokens: SemanticTokensListing = {
	colors: {
		border: {
			default: "gray.200",
			_dark: "whiteAlpha.300",
		},
		shade: {
			"50": {
				default: "blackAlpha.50",
				_dark: "whiteAlpha.50",
			},
			"100": {
				default: "blackAlpha.100",
				_dark: "whiteAlpha.100",
			},
			"200": {
				default: "blackAlpha.200",
				_dark: "whiteAlpha.200",
			},
			"300": {
				default: "blackAlpha.300",
				_dark: "whiteAlpha.300",
			},
			"400": {
				default: "blackAlpha.400",
				_dark: "whiteAlpha.400",
			},
			"500": {
				default: "blackAlpha.500",
				_dark: "whiteAlpha.500",
			},
			"600": {
				default: "blackAlpha.600",
				_dark: "whiteAlpha.600",
			},
			"700": {
				default: "blackAlpha.700",
				_dark: "whiteAlpha.700",
			},
			"800": {
				default: "blackAlpha.800",
				_dark: "whiteAlpha.800",
			},
			"900": {
				default: "blackAlpha.900",
				_dark: "whiteAlpha.900",
			},
		},
	},
};

export default semanticTokens;

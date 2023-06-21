import { Theme, useColorModeValue } from "@chakra-ui/react";

export type ModeSensitiveColor = keyof Theme["colors"];

const useModeSensitiveColor = (colorName: ModeSensitiveColor) =>
	useColorModeValue(`${colorName}.500`, `${colorName}.200`);

export default useModeSensitiveColor;

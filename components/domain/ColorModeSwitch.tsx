import { IconButton, IconButtonProps } from "@chakra-ui/button";
import { useColorMode, useColorModeValue } from "@chakra-ui/color-mode";
import { SunnyOutlineIcon, MoonOutlineIcon } from "chakra-ui-ionicons";

/**
 * Button to switch between color modes
 *
 * @param {Omit<IconButtonProps, "onClick" | "icon" | "aria-label">} props The
 * style props for an IconButton but with the props required for button functionality
 * omitted
 * @returns {React.ReactElement} Component stuff
 */
const ColorModeSwitch: React.FC<
	Omit<IconButtonProps, "onClick" | "icon" | "aria-label">
> = ({ ...props }) => {
	const { toggleColorMode } = useColorMode();
	const SwitchIcon = useColorModeValue(MoonOutlineIcon, SunnyOutlineIcon);
	const oppositeColorMode = useColorModeValue("dark", "light");
	return (
		<IconButton
			aria-label={"change color mode to " + oppositeColorMode + " mode"}
			icon={<SwitchIcon boxSize={6} />}
			onClick={toggleColorMode}
			{...props}
		/>
	);
};

export default ColorModeSwitch;

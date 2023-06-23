import {
	ButtonProps,
	IconButton,
	IconButtonProps,
	DarkMode,
	LightMode,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/react";
import { SunnyOutlineIcon, MoonOutlineIcon } from "chakra-ui-ionicons";

type LimitedButtonProps = Omit<
	ButtonProps | IconButtonProps,
	"onClick" | "icon" | "aria-label" | "leftIcon"
>;

interface ColorModeSwitchProps extends LimitedButtonProps {
	iconOnly?: boolean;
	useLightModeColors?: boolean;
	useDarkModeColors?: boolean;
}

const ColorModeSwitch: React.FC<ColorModeSwitchProps> = ({
	useLightModeColors,
	useDarkModeColors,
	...props
}) => {
	const { toggleColorMode } = useColorMode();
	const SwitchIcon = useColorModeValue(SunnyOutlineIcon, MoonOutlineIcon);
	const oppositeColorMode = useColorModeValue("dark", "light");

	const commonProps: Pick<
		IconButtonProps,
		"aria-label" | "variant" | "onClick"
	> = {
		"aria-label": "change color mode to " + oppositeColorMode + " mode",
		variant: "ghost",
		onClick: toggleColorMode,
	};

	const iconElement = <SwitchIcon boxSize="icon" />;

	const switchElement = (
		<IconButton isRound {...commonProps} {...props} icon={iconElement} />
	);

	if (useDarkModeColors) {
		return <DarkMode>{switchElement}</DarkMode>;
	} else if (useLightModeColors) {
		<LightMode>{switchElement}</LightMode>;
	}
	return switchElement;
};

export default ColorModeSwitch;

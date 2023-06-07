import {
	Button,
	ButtonProps,
	IconButton,
	IconButtonProps,
	DarkMode,
	LightMode,
	useColorMode,
	useColorModeValue,
	ColorMode,
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

const colorModeLabels: Record<ColorMode, string> = {
	dark: "Dark",
	light: "Light",
};

const ColorModeSwitch: React.FC<ColorModeSwitchProps> = ({
	iconOnly = false,
	useLightModeColors,
	useDarkModeColors,
	...props
}) => {
	const { colorMode, toggleColorMode } = useColorMode();
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

	const switchElement = iconOnly ? (
		<IconButton isRound {...commonProps} {...props} icon={iconElement} />
	) : (
		<Button
			{...commonProps}
			width={32}
			{...props}
			leftIcon={iconElement}
			id="color-switch"
		>
			{colorModeLabels[colorMode]} Mode
		</Button>
	);

	if (useDarkModeColors) {
		return <DarkMode>{switchElement}</DarkMode>;
	} else if (useLightModeColors) {
		<LightMode>{switchElement}</LightMode>;
	}
	return switchElement;
};

export default ColorModeSwitch;

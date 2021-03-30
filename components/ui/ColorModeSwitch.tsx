import {
	Button,
	ButtonProps,
	IconButton,
	IconButtonProps,
} from "@chakra-ui/button";
import {
	DarkMode,
	LightMode,
	useColorMode,
	useColorModeValue,
} from "@chakra-ui/color-mode";
import { StyleProps } from "@chakra-ui/styled-system";
import { SunnyOutlineIcon, MoonOutlineIcon } from "chakra-ui-ionicons";
import codeToTitle from "code-to-title";

type LimitedButtonProps = Omit<
	ButtonProps | IconButtonProps,
	"onClick" | "icon" | "aria-label" | "leftIcon"
>;

interface ColorModeSwitchProps extends LimitedButtonProps {
	iconOnly?: boolean;
	forceLightMode?: boolean;
	forceDarkMode?: boolean;
}

/**
 * Button to switch between color modes
 *
 * @param {Omit<IconButtonProps, "onClick" | "icon" | "aria-label">} props The
 * style props for an IconButton but with the props required for button functionality
 * omitted
 * @returns {React.ReactElement} Component stuff
 */
const ColorModeSwitch: React.FC<ColorModeSwitchProps> = ({
	iconOnly = false,
	forceLightMode,
	forceDarkMode,
	...props
}) => {
	const { colorMode, toggleColorMode } = useColorMode();
	const SwitchIcon = useColorModeValue(MoonOutlineIcon, SunnyOutlineIcon);
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
		<Button {...commonProps} width={32} {...props} leftIcon={iconElement}>
			{codeToTitle(colorMode)} Mode
		</Button>
	);

	if (forceDarkMode) {
		return <DarkMode>{switchElement}</DarkMode>;
	} else if (forceLightMode) {
		<LightMode>{switchElement}</LightMode>;
	}
	return switchElement;
};

export default ColorModeSwitch;

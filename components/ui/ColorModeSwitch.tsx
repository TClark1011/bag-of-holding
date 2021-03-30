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
import { SunnyOutlineIcon, MoonOutlineIcon } from "chakra-ui-ionicons";
import codeToTitle from "code-to-title";

type LimitedButtonProps = Omit<
	ButtonProps | IconButtonProps,
	"onClick" | "icon" | "aria-label" | "leftIcon"
>;

interface ColorModeSwitchProps extends LimitedButtonProps {
	iconOnly?: boolean;
	useLightModeColors?: boolean;
	useDarkModeColors?: boolean;
}

/**
 * Button to switch between color modes
 *
 * @param {object} props The
 * style props for an IconButton but with the props required for button functionality
 * omitted
 * @param {boolean} [props.iconOnly=false] if true, the switch will use an 'IconButton'
 * and will only display an icon without any text
 * @param {boolean} [props.useLightModeColors]
 * @param {boolean} [props.useDarkModeColors]
 * @returns {React.ReactElement} Component stuff
 */
const ColorModeSwitch: React.FC<ColorModeSwitchProps> = ({
	iconOnly = false,
	useLightModeColors,
	useDarkModeColors,
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

	if (useDarkModeColors) {
		return <DarkMode>{switchElement}</DarkMode>;
	} else if (useLightModeColors) {
		<LightMode>{switchElement}</LightMode>;
	}
	return switchElement;
};

export default ColorModeSwitch;

import { Flex, HStack } from "@chakra-ui/layout";
import { HelpOutlineIcon, MailOutlineIcon } from "chakra-ui-ionicons";
import React from "react";
import { contactPageUrl, infoPageUrl } from "../../constants/urls";
import BagOfHoldingIcon from "../icons/BagOfHoldingIcon";
import ColorModeSwitch from "../ui/ColorModeSwitch";
import GitLink from "../ui/GitLink";
import IconLink from "../ui/IconLink";

export interface TopNavProps {
	showHomeLink?: boolean;
}

/**
 * The top navigation bar
 *
 * @param {object} props The props
 * @param {boolean} [props.showHomeLink=true] Whether or not
 * to show a link to the app's home page
 * @returns {React.ReactElement} The rendered top navigation bar
 */
const TopNav: React.FC<TopNavProps> = ({ showHomeLink = true }) => (
	<Flex justify="space-between" padding={2} width="full" position="absolute">
		<HStack justify="flex-end">
			{showHomeLink && (
				<IconLink
					href="/"
					aria-label="link to home page"
					icon={<BagOfHoldingIcon boxSize={6} thickStroke />}
					variant="unstyled"
				/>
			)}
			<GitLink />
			<IconLink
				display="none"
				href={contactPageUrl}
				aria-label="link to contact page"
				icon={<MailOutlineIcon boxSize="icon" />}
				variant="ghost"
			/>
			<IconLink
				display="none"
				href={infoPageUrl}
				aria-label="link to info page"
				icon={<HelpOutlineIcon boxSize="icon" />}
				variant="ghost"
			/>
		</HStack>
		<ColorModeSwitch />
	</Flex>
);

export default TopNav;

import { Flex, HStack } from "@chakra-ui/layout";
import {
	HelpOutlineIcon,
	MailOutlineIcon,
	LogoRedditIcon,
} from "chakra-ui-ionicons";
import React from "react";
import { contactPageUrl, infoPageUrl } from "../../constants/urls";
import BagOfHoldingIcon from "../icons/BagOfHoldingIcon";
import ColorModeSwitch from "../ui/ColorModeSwitch";
import GitLink from "../ui/GitLink";
import IconLink from "../ui/IconLink";
import { appSubredditLink } from "../../constants/branding";

export const topNavHeight = 16;

export interface TopNavProps {
	showHomeLink?: boolean;
}

/**
 * The top navigation bar
 *
 * @param props The props
 * @param [props.showHomeLink=true] Whether or not
 * to show a link to the app's home page
 * @returns The rendered top navigation bar
 */
const TopNav: React.FC<TopNavProps> = ({ showHomeLink = true }) => (
	<Flex
		justify="space-between"
		padding={2}
		width="full"
		position="absolute"
		height={topNavHeight}
	>
		<HStack justify="flex-end">
			{showHomeLink && (
				<IconLink
					href="/"
					aria-label="link to home page"
					icon={<BagOfHoldingIcon boxSize={5} thickStroke />}
				/>
			)}
			<GitLink />
			<IconLink
				href={appSubredditLink}
				aria-label="link to info page"
				icon={<LogoRedditIcon boxSize="icon" />}
				variant="ghost"
			/>
			<IconLink
				href={contactPageUrl}
				aria-label="link to contact page"
				icon={<MailOutlineIcon boxSize="icon" />}
			/>
			<IconLink
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

import { Flex, HStack } from "@chakra-ui/react";
import {
	HelpOutlineIcon,
	MailOutlineIcon,
	LogoRedditIcon,
} from "chakra-ui-ionicons";
import React from "react";
import {
	BagOfHoldingIcon,
	ColorModeSwitch,
	GitLink,
	IconLink,
} from "$root/components";
import { appSubredditLink, contactPageUrl, infoPageUrl } from "$root/constants";

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
					id="home-link"
					href="/"
					aria-label="link to home page"
					icon={<BagOfHoldingIcon boxSize={5} thickStroke />}
				/>
			)}
			<GitLink id="git-link" />
			<IconLink
				id="reddit-link"
				href={appSubredditLink}
				aria-label="link to info page"
				icon={<LogoRedditIcon boxSize="icon" />}
				variant="ghost"
			/>
			<IconLink
				id="contact-link"
				href={contactPageUrl}
				aria-label="link to contact page"
				icon={<MailOutlineIcon boxSize="icon" />}
			/>
			<IconLink
				id="info-link"
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

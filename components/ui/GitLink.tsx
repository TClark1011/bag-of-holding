import { IconButton, IconButtonProps } from "@chakra-ui/button";
import { LogoGithubIcon } from "chakra-ui-ionicons";
import Link from "next/link";
import { appGitLink } from "../../constants/branding";

type GitLinkProps = Omit<IconButtonProps, "aria-label" | "icon" | "children">;

/**
 * An icon that works as a link to the Github repository
 * page
 *
 * @param {object} props The props
 * @returns {React.ReactElement} Icon button that links
 * to the github repository
 */
const GitLink: React.FC<GitLinkProps> = (props) => (
	<Link href={appGitLink}>
		<IconButton
			isRound
			variant="ghost"
			{...props}
			aria-label="link to github repository"
			icon={<LogoGithubIcon boxSize="icon" />}
		/>
	</Link>
);

export default GitLink;

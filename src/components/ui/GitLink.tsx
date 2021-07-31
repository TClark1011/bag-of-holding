import { IconButton, IconButtonProps } from "@chakra-ui/button";
import { Link } from "@chakra-ui/layout";
import { LogoGithubIcon } from "chakra-ui-ionicons";
import { appGitLink } from "../../constants/branding";

type GitLinkProps = Omit<IconButtonProps, "aria-label" | "icon" | "children">;

/**
 * An icon that works as a link to the Github repository
 * page
 *
 * @param props The props
 * @returns Icon button that links
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

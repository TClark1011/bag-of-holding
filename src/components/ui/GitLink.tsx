import { Link, IconButton, IconButtonProps } from "@chakra-ui/react";
import { LogoGithubIcon } from "chakra-ui-ionicons";
import { appGitLink } from "$root/constants";

type GitLinkProps = Omit<IconButtonProps, "aria-label" | "icon" | "children">;

/**
 * An icon that works as a link to the Github repository
 * page
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

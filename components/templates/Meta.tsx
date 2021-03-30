import Head from "next/head";
import { appDescription, appName } from "../../constants/meta";

interface MetaProps {
	description?: string;
	title?: string;
	image?: string;
	url?: string;
}

/**
 * Component for conveniently generating metadata
 *
 * @param {object} props The props
 * @param {string} [props.title] The title of the page.
 * Defaults to the 'appDescription' title.
 * @param {string} [props.description] The description of
 * the page. Defaults to the 'appDescription' constant.
 * @param {string} [props.image] The path to the image to
 * appear in link previews. Defaults to the path of the
 * 'ogIndex' file.
 * @param {string} [props.url] The url to use for the
 * 'og:url' and 'canonical' meta data tags. These tags
 * will not be used if this parameter is not provided.
 * @returns {React.ReactElement} Metadata tags
 */
const Meta: React.FC<MetaProps> = ({
	description = appDescription,
	title = appName,
	image = "/ogImages/ogIndex.png",
	url,
}) => (
	<Head>
		<title key="title">{title}</title>
		<meta property="og:title" content={title} key="ogTitle" />

		<meta name="description" content={description} key="ogDescription" />
		<meta property="og:description" content={description} key="description" />

		<meta property="og:image" content={image} key="ogImage" />

		{url && (
			<>
				<meta property="og:url" content={url} key="ogUrl" />
				<link rel="canonical" href={url} />
			</>
		)}

		{/* Some metadata that will be constant between all pages are defined in the 'Head' of '_app.tsx' */}
	</Head>
);

export default Meta;

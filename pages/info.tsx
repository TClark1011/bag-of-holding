import { Box, Center, Flex, VStack } from "@chakra-ui/layout";
import { chakra } from "@chakra-ui/system";
import View from "../components/templates/View";
import { H3, Paragraph, SectionTitle } from "../components/ui/Typography";
import { infoPageUrl } from "../constants/urls";

const QuestionTitle = chakra(H3, { baseStyle: { marginBottom: 4 } });

/**
 * @param root0
 * @param root0.title
 * @param root0.chilren
 * @param root0.children
 */
const InfoPageQuestion: React.FC<{ title: string }> = ({ title, children }) => (
	<Box width="full">
		<H3 marginBottom={4}>{title}</H3>
		<VStack>{children}</VStack>
	</Box>
);

/**
 *
 */
const InfoPage: React.FC = () => {
	return (
		<View
			title="Bag of Holding | Info"
			description="Information about Bag of Holding"
			url={infoPageUrl}
		>
			<Box paddingX={[0, 2, 4, 8]}>
				<SectionTitle>Info</SectionTitle>
				<VStack spacing="break">
					<InfoPageQuestion title="What is Bag of Holding?">
						<Paragraph>
							Bag of Holding is a web app that {"let's"} tabletop RPG players
							track their {"group's"} inventory with ease by allowing players to
							pool their individual inventories into a central location.
						</Paragraph>
					</InfoPageQuestion>
					<InfoPageQuestion title="How Do I Save My Sheet?"></InfoPageQuestion>
				</VStack>
			</Box>
		</View>
	);
};

export default InfoPage;

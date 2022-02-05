import { Flex, Heading } from "@chakra-ui/react";

export const Hero = ({ title }: { title: string }) => (
  <Flex
    alignItems="center"
    bgClip="text"
    bgGradient="linear(to-l, #7928CA, #FF0080)"
    height="15vh"
    justifyContent="center"
  >
    <Heading fontSize="6vw">{title}</Heading>
  </Flex>
);

Hero.defaultProps = {
  title: "chakra-icons",
};

import { Hero, Main, Overview } from "../components";

import { MetaIcon } from "@chakra-icons/core";
import { Code, Text } from "@chakra-ui/react";
import fs from "fs/promises";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import path from "path";

export const getStaticProps: GetStaticProps<{ icons: MetaIcon | null }> = async (_ctx) => {
  const icons: MetaIcon | null =
    JSON.parse(
      (await fs.readFile(path.resolve("../packages/@chakra-icons/bootstrap/snapshot.json"), { encoding: "utf8" })) ||
        "",
    ) || null;
  return {
    props: { icons },
  };
};

const Index = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const icons = props.icons?.sources.flatMap((src) => src.entries.map(({ name }) => name)) ?? [];
  return (
    <Main>
      <Hero />
      <Text fontWeight="bold">
        Total icons <Code colorScheme="blue">{icons.length}</Code>
      </Text>
      <Overview icons={icons} />
    </Main>
  );
};

export default Index;

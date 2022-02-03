import * as React from "react";

import { Hero, Main, Overview } from "../components";
import { ResponseIcon } from "../types";

import { getData } from "./api/[...icons]";

import { Code, Input, Text } from "@chakra-ui/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";

type IndexProps = {
  icons: ResponseIcon | null;
};

export const getStaticProps: GetStaticProps<IndexProps> = async (_ctx) => {
  const icons = await getData("", 50);
  return {
    props: { icons },
  };
};

const Index = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { icons: _icons } = props;
  const [icons, setIcons] = React.useState<typeof props.icons>(_icons);
  const onKeyPressCapture = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toLowerCase() === "enter") {
      fetch(`/api/icons?q=${e.currentTarget.value}`)
        .then((res) => res.json())
        .then(setIcons)
        .catch(console.error);
    } else {
      e.persist();
    }
  };
  return (
    <Main alignItems="center">
      <Hero />
      <Text maxW={{ md: "50vw" }} align="center">
        We have been provided total <Code colorScheme="cyan">{icons?.total}</Code> icons, Included popular icons like
        `Bootstrap`, `Flat-Icon`, and more to use in your project with <Code colorScheme="teal">Chakra-UI</Code>.
      </Text>
      <Input
        placeholder="Search icons here..."
        width={["full", "full", "50vw"]}
        size="lg"
        onKeyPressCapture={onKeyPressCapture}
      />
      <Overview icons={icons?.data ?? []} />
    </Main>
  );
};

export default Index;

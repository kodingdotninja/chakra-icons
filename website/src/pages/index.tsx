import * as React from "react";

import { Hero, Main, Overview } from "../components";
import { ResponseIcon } from "../types";

import { getData } from "./api/[...icons]";

import { Code, Input, Text } from "@chakra-ui/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";

type IndexProps = {
  icons: ResponseIcon | null;
};

export const getStaticProps: GetStaticProps<IndexProps> = async (_ctx) => {
  const icons = await getData("", 50);
  return {
    props: { icons },
  };
};

const fetchIcons = (q?: string): Promise<ResponseIcon> => fetch(`/api/icons?q=${q ?? ""}`).then((res) => res.json());

const Index = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { query } = useRouter();
  const { icons: _icons } = props;
  const [icons, setIcons] = React.useState<typeof props.icons>(_icons);

  const q = Array.isArray(query.q) ? query.q[0] : query.q ?? "";

  const onKeyPressCapture = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toLowerCase() === "enter") {
      fetchIcons(e.currentTarget.value).then(setIcons).catch(console.error);
    } else {
      e.persist();
    }
  };

  React.useEffect(() => {
    if (q !== "") fetchIcons(q).then(setIcons).catch(console.error);
  }, [q]);

  return (
    <Main alignItems="center">
      <Hero />
      <Text align="center" maxW={{ md: "50vw" }}>
        We have been provided <Code colorScheme="cyan">{icons?.total}</Code> icons, Included popular icons like
        `Bootstrap`, `Flat-Icon`, and more to use in your project with <Code colorScheme="teal">Chakra-UI</Code>.
      </Text>
      <Input
        defaultValue={query.q ?? ""}
        onKeyPressCapture={onKeyPressCapture}
        placeholder="Search icons here..."
        size="lg"
        width={["full", "full", "50vw"]}
      />
      <Overview icons={icons?.data ?? []} />
    </Main>
  );
};

export default Index;

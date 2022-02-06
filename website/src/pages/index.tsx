import * as React from "react";

import { Hero, Main, Overview } from "../components";
import { ResponseIcon } from "../types";

import { getData } from "./api/[...icons]";

import { Checkbox, Code, Input, SimpleGrid, Text } from "@chakra-ui/react";
import { GetStaticProps, InferGetStaticPropsType } from "next";

type IndexProps = {
  icons: ResponseIcon | null;
};

export const getStaticProps: GetStaticProps<IndexProps> = async (_ctx) => {
  const icons = await getData("", "", 50);
  return {
    props: { icons },
  };
};

const fetchIcons = ({ q, qCreator }: { q?: string; qCreator?: string }): Promise<ResponseIcon> =>
  fetch(`/api/icons?q=${q ?? ""}&qCreator=${qCreator ?? ""}`).then((res) => res.json());

const Index = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { icons: _icons } = props;
  const [icons, setIcons] = React.useState<typeof props.icons>(_icons);
  const [queryCreator, setQueryCreator] = React.useState<string[]>([]);
  const [querySearch, setQuerySearch] = React.useState<string>("");

  const onKeyPressCapture = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key.toLowerCase() === "enter") {
      setQuerySearch(e.currentTarget.value);
    } else {
      e.persist();
    }
  };

  React.useEffect(() => {
    fetchIcons({ q: querySearch, qCreator: queryCreator.join(" ") ?? "" })
      .then(setIcons)
      .catch(console.error);
  }, [querySearch, queryCreator]);

  return (
    <Main alignItems="center">
      <Hero />
      <Text align="center" maxW={{ md: "50vw" }}>
        We have been provided <Code colorScheme="cyan">{icons?.total}</Code> icons, Included popular icons like
        `Bootstrap`, `Flat-Icon`, and more to use in your project with <Code colorScheme="teal">Chakra-UI</Code>.
      </Text>
      <Input
        defaultValue={querySearch}
        onKeyPressCapture={onKeyPressCapture}
        placeholder="Search icons here..."
        size="lg"
        width={["full", "full", "50vw"]}
      />
      <SimpleGrid columns={[2, 3, 4]} spacing={4}>
        {icons?.creators?.map((item) => (
          <Checkbox
            key={item}
            checked={!!queryCreator.find((i) => i === item)}
            color={queryCreator.find((i) => i === item) ? "blue.500" : "gray.300"}
            onChange={() => {
              setQueryCreator((oldState) => {
                return oldState.find((i) => i === item) ? oldState.filter((i) => i !== item) : [item, ...oldState];
              });
            }}
          >
            {item}
          </Checkbox>
        ))}
      </SimpleGrid>

      <Overview icons={icons?.data ?? []} />
    </Main>
  );
};

export default Index;

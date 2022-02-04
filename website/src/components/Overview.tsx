import * as React from "react";

import { MetaIcon } from "../types";

import * as Bootstrap from "@chakra-icons/bootstrap";
import * as FlatIcon from "@chakra-icons/flat-icon";
import * as Octicons from "@chakra-icons/octicons";
import * as TablerIcons from "@chakra-icons/tabler-icons";
import {
  Code,
  ComponentWithAs,
  IconProps,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  StackProps,
  Text,
} from "@chakra-ui/react";

type Icon = Omit<MetaIcon, "iconPath" | "sources" | "clonePath" | "sourcePath"> & {
  creator: string;
  code: string;
};

const Item = ({ children, name, code }: StackProps & Icon) => {
  const color = "gray.300";
  const hoverColor = "blue.500";
  return (
    <Popover isLazy placement="top-start">
      <PopoverTrigger>
        <Stack
          cursor="pointer"
          borderWidth="thin"
          borderStyle="dotted"
          color={color}
          fill={color}
          borderColor={color}
          borderRadius="lg"
          _hover={{
            color: hoverColor,
            fill: hoverColor,
            borderStyle: "solid",
            borderColor: hoverColor,
          }}
          boxSize="24"
          alignItems="center"
          justifyContent="center"
          aria-label={name}
        >
          {React.isValidElement(children) ? React.cloneElement(children, { boxSize: "9" }) : null}
          <Text fontWeight="bold" fontSize="xs" isTruncated maxW="full" px="2">
            {name}
          </Text>
        </Stack>
      </PopoverTrigger>
      <PopoverContent width="auto">
        <PopoverHeader fontWeight="semibold">{name}</PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Code colorScheme="blackAlpha">{code}</Code>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export function Overview({ icons }: { icons: Icon[] }) {
  return (
    <SimpleGrid columns={[3, 6, 6, 7]} spacing={[8, 5, 5, 5]}>
      {icons
        .map((icon) => {
          const { name: iconName, creator } = icon;
          const getComponent = (name: string, _creator: string): ComponentWithAs<"svg", IconProps> | undefined =>
            ({
              true: () => undefined,
              [String(_creator === "bootstrap")]: () =>
                // @ts-expect-error: THIS WORKS
                Bootstrap[name],
              [String(_creator === "flat-icon")]: () =>
                // @ts-expect-error: THIS WORKS
                FlatIcon[name],
              [String(_creator === "octicons")]: () =>
                // @ts-expect-error: THIS WORKS
                Octicons[name],
              [String(_creator === "tabler-icons")]: () =>
                // @ts-expect-error: THIS WORKS
                TablerIcons[name],
            }.true());

          const Component = getComponent(iconName, creator.toLowerCase());

          if (Component) {
            return (
              <Item key={`${iconName}${creator}`} {...icon}>
                <Component />
              </Item>
            );
          }
          return null;
        })
        .filter(Boolean)}
    </SimpleGrid>
  );
}

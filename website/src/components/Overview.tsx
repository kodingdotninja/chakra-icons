import * as React from "react";

import { ApiIcon } from "../types";

import * as Bootstrap from "@chakra-icons/bootstrap";
import * as Carbon from "@chakra-icons/carbon";
import * as Feather from "@chakra-icons/feather";
import * as FlatIcon from "@chakra-icons/flat-icon";
import * as Ionicons from "@chakra-icons/ionicons";
import * as Octicons from "@chakra-icons/octicons";
import * as SimpleLineIcons from "@chakra-icons/simple-line-icons";
import * as TablerIcons from "@chakra-icons/tabler-icons";
import * as TypIcons from "@chakra-icons/typicons";
import {
  Button,
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
  useToast,
} from "@chakra-ui/react";

const Item = ({ children, name, code, creator, ...props }: StackProps & ApiIcon) => {
  const color = "gray.300";
  const hoverColor = "blue.500";
  const toast = useToast();
  return (
    <Popover isLazy placement="top-start">
      <PopoverTrigger>
        <Stack
          _hover={{
            color: hoverColor,
            fill: hoverColor,
            borderStyle: "solid",
            borderColor: hoverColor,
          }}
          alignItems="center"
          aria-label={name}
          borderColor={color}
          borderRadius="lg"
          borderStyle="dotted"
          borderWidth="thin"
          boxSize="24"
          color={color}
          cursor="pointer"
          fill={color}
          justifyContent="center"
          {...props}
        >
          {React.isValidElement(children) ? React.cloneElement(children, { boxSize: "9" }) : null}
          <Text fontSize="xs" fontWeight="bold" isTruncated maxW="full" px="2">
            {name}
          </Text>
        </Stack>
      </PopoverTrigger>
      <PopoverContent width="auto">
        <PopoverHeader fontWeight="bold">
          {creator} / {name}
        </PopoverHeader>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Code colorScheme="blackAlpha">{code}</Code>
          <Button
            ml={2}
            onClick={() => {
              navigator.clipboard
                .writeText(code)
                .then(() => {
                  toast({
                    title: "Copied to clipboard.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                  });
                })
                .catch(console.error);
            }}
            size="xs"
          >
            Copy
          </Button>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export function Overview({ icons }: { icons: ApiIcon[] }) {
  return (
    <SimpleGrid columns={[3, 6, 6, 7]} spacing={[8, 5, 5, 5]}>
      {icons
        .map((icon) => {
          const { name: iconName, creator } = icon;
          const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];
          const getComponent = (name: string, _creator: string): ComponentWithAs<"svg", IconProps> | undefined =>
            ({
              true: () => undefined,
              // this line code `name as keof typeof SOMETHING` is still exist for prevent "Argument of type 'String' is not assignable to parameter of type"
              // this is not a best practice :)
              [String(_creator === "bootstrap")]: () => getKeyValue(Bootstrap, name as keyof typeof Bootstrap),
              [String(_creator === "flat-icon")]: () => getKeyValue(FlatIcon, name as keyof typeof FlatIcon),
              [String(_creator === "octicons")]: () => getKeyValue(Octicons, name as keyof typeof Octicons),
              [String(_creator === "tabler-icons")]: () => getKeyValue(TablerIcons, name as keyof typeof TablerIcons),
              [String(_creator === "typicons")]: () => getKeyValue(TypIcons, name as keyof typeof TypIcons),
              [String(_creator === "carbon")]: () => getKeyValue(Carbon, name as keyof typeof Carbon),
              [String(_creator === "feather")]: () => getKeyValue(Feather, name as keyof typeof Feather),
              [String(_creator === "simple-line-icons")]: () =>
                getKeyValue(SimpleLineIcons, name as keyof typeof SimpleLineIcons),
              [String(_creator === "ionicons")]: () => getKeyValue(Ionicons, name as keyof typeof Ionicons),
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

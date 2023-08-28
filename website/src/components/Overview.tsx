import * as Bootstrap from "@chakra-icons/bootstrap";
import * as Carbon from "@chakra-icons/carbon";
import * as CryptoCurrency from "@chakra-icons/cryptocurrency-icons";
import * as Feather from "@chakra-icons/feather";
import * as FlatIcon from "@chakra-icons/flat-icon";
import * as Ionicons from "@chakra-icons/ionicons";
import * as Octicons from "@chakra-icons/octicons";
import * as SimpleLineIcons from "@chakra-icons/simple-line-icons";
import * as TablerIcons from "@chakra-icons/tabler-icons";
import * as TypIcons from "@chakra-icons/typicons";
import type { ComponentWithAs, IconProps, StackProps } from "@chakra-ui/react";
import { HStack, SimpleGrid, Stack, Text, Tooltip, useClipboard, useDisclosure, useToast } from "@chakra-ui/react";
import * as React from "react";

import type { ApiIcon } from "../types";

const Item = ({ children, name, code, creator, ...props }: StackProps & ApiIcon) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const iconRef = React.useRef<HTMLElement & SVGElement>(null);
  const { onCopy: _onCopySVG } = useClipboard(iconRef.current?.outerHTML ?? "");
  const { onCopy: _onCopyCode } = useClipboard(code);
  const toast = useToast();

  const onCopySVG = () => {
    _onCopySVG();
    toast({
      title: "Copied SVG to clipboard.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const onCopyCode = () => {
    _onCopyCode();
    toast({
      title: "Copied Import Code to clipboard.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const color = "gray.300";
  const hoverColor = "blue.500";

  return (
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
      fill={color}
      justifyContent="center"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      {...props}
    >
      {React.isValidElement(children) ? React.cloneElement(children, { boxSize: "9", ref: iconRef } as object) : null}
      {isOpen ? (
        <HStack color="gray.900" fill="gray.900" isInline spacing="3">
          <Tooltip hasArrow label="copy Import Code to clipboard." shouldWrapChildren>
            <Carbon.Copy
              _hover={{
                color: hoverColor,
                fill: hoverColor,
              }}
              cursor="pointer"
              onClick={onCopyCode}
            />
          </Tooltip>
          {iconRef.current ? (
            <Tooltip label="copy SVG to clipboard." shouldWrapChildren>
              <Bootstrap.FiletypeSvg
                _hover={{
                  color: hoverColor,
                  fill: hoverColor,
                }}
                cursor="pointer"
                onClick={onCopySVG}
              />
            </Tooltip>
          ) : null}
        </HStack>
      ) : (
        <Text fontSize="xs" fontWeight="bold" isTruncated maxW="full" px="2">
          {name}
        </Text>
      )}
    </Stack>
  );
};

export const Overview = ({ icons }: { icons: ApiIcon[] }) => (
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
            [String(_creator === "cryptocurrency-icons")]: () =>
              getKeyValue(CryptoCurrency, name as keyof typeof CryptoCurrency),
          }).true();

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

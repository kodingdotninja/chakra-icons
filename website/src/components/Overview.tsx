import * as React from "react";

import * as Bootstrap from "@chakra-icons/bootstrap";
import { ComponentWithAs, IconProps, SimpleGrid, Stack, StackProps } from "@chakra-ui/react";

const Item = ({ children }: StackProps) => {
  const color = "gray.300";
  const hoverColor = "blue.500";
  return (
    <Stack
      cursor="pointer"
      borderWidth="0.3vh"
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
      boxSize="15vh"
      alignItems="center"
      justifyContent="center"
    >
      {React.isValidElement(children) ? React.cloneElement(children, { boxSize: "5vh" }) : null}
    </Stack>
  );
};

export function Overview({ icons }: { icons: string[] }) {
  return (
    <SimpleGrid columns={[2, 4, 4, 5, 7]} spacing="10">
      {icons
        .map((iconName) => {
          const getComponent = (name: string): ComponentWithAs<"svg", IconProps> | undefined =>
            Bootstrap
              ? // @ts-expect-error this is access submodule
                Bootstrap[name]
              : undefined;

          const Component = getComponent(iconName);

          if (Component) {
            return (
              <Item key={iconName}>
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

Overview.defaultProps = {
  icons: ["Activity", "Stack", "N0Thing", "Info"],
};

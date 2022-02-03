const updateRootReadmeTemplate = `| [@chakra-icons/{{name}}](https://github.com/kodingdotninja/chakra-icons/tree/main/packages/@chakra-icons/{{name}}) | ✅  | [![@chakra-icons/{{name}} version](https://badge.fury.io/js/@chakra-icons%2F{{name}}.svg)](https://www.npmjs.com/package/@chakra-icons/{{name}}) |\n<!-- APPEND_CHAKRA_ICONS_HERE -->`;

// see ./tooling/cli/src/init.ts#InitOptions
const prompts = [
  { type: "input", name: "repository", message: "repository url" },
  { type: "input", name: "iconPath", message: "path of svg icons" },
  { type: "input", name: "name", message: "projects name (e.g: bootstrap)" },
];

const actions = [
  {
    type: "add",
    path: "packages/@chakra-icons/{{name}}/src/.git-keep",
    templateFile: "templates/empty",
  },
  {
    type: "add",
    path: "packages/@chakra-icons/{{name}}/package.json",
    templateFile: "templates/@chakra-icons/package.json",
  },
  {
    type: "add",
    path: "packages/@chakra-icons/{{name}}/tsconfig.json",
    templateFile: "templates/@chakra-icons/tsconfig.json",
  },
  {
    type: "add",
    path: "packages/@chakra-icons/{{name}}/tsup.config.ts",
    templateFile: "templates/@chakra-icons/tsup.config.ts",
  },
  {
    type: "add",
    path: "packages/@chakra-icons/{{name}}/README.md",
    templateFile: "templates/@chakra-icons/README.md",
  },
  {
    type: "add",
    path: "packages/@chakra-icons/{{name}}/.releaserc.js",
    templateFile: "templates/@chakra-icons/.releaserc.js",
  },
  {
    type: "modify",
    path: "README.md",
    pattern: /<!-- APPEND_CHAKRA_ICONS_HERE -->/g,
    template: updateRootReadmeTemplate,
  },
];

export default function init(plop) {
  plop.setGenerator("init", {
    description: "init icons projects in @chakra-icons",
    prompts, // array of inquirer prompts
    actions, // array of actions
  });
}

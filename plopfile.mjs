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
];

export default function init(plop) {
  plop.setGenerator("init", {
    description: "init icons projects in @chakra-icons",
    prompts, // array of inquirer prompts
    actions, // array of actions
  });
}

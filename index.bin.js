#!/usr/bin/env node
/**
 * usage
 *
 * TODO: Pipeable in shell
 *
 * # Input
 * ```console
 * cat icon.svg | npx create-chakra-icons
 * ```
 * # Output
 * ```console
 * export const Icon = createIcon({
 *  displayName: "Icon",
 *  viewBox: "0 0 0 0",
 *  d: "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0",
 * })
 * ```
 */
const Fs = require("fs");
// const Task = require("folktale/concurrency/task");
// const Maybe = require("folktale/maybe");
// const Result = require("folktale/result");
const SvgParser = require("svg-parser");
// const HastUtils = require("@svgr/hast-util-to-babel-ast").default;
const BabelGenerator = require("@babel/generator").default;
const argv = require("minimist")(process.argv.slice(2));
const {
  createChakraProperties,
  createChakraFunctional,
  createSourceChakraIcon,
  hastSVGToChakraProperties,
} = require("./lib");

main(argv);

// :: [Object] -> () *Effect*
function main(args) {
  const stdin = process.openStdin();
  let data = "";
  stdin.on("data", (chunk) => {
    data += chunk;
  });

  stdin.on("end", () => {
    const svgHast = SvgParser.parse(data);
    const name = args.name || args.n || "<NamedHere>";

    const chakraProperties = createChakraProperties({
      displayName: name,
      ...hastSVGToChakraProperties(svgHast),
    });

    const iconAst = createChakraFunctional({
      displayName: name,
      objectExpression: [chakraProperties],
    });

    const sourceAst = createSourceChakraIcon(iconAst);
    const { code: source } = BabelGenerator(sourceAst);
    process.stdout.write(source);
  });
}

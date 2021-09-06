/**
 * @module chakra
 * @description the module for generate Chakra Icon Code.
 */
const SvgParser = require("svg-parser");
const ast = require("./ast");
/**
 * @memberof chakra
 * @name createChakraIcon
 * @param {String} svg
 * @param {String} displayName
 * @returns {Object}
 */
const createChakraIcon = (displayName, ...sources) => {
  const perFileCode = ({ source: svg, displayName }) => {
    const hast = SvgParser.parse(svg);

    if (ast.hastChildrenLength(hast) > 1) {
      return ast.hastToComponent(hast, displayName);
    }

    const properties = ast.hastToProperties(hast);

    const objectExpression = ast.objectToObjectExpression({
      displayName,
      ...properties,
    });

    const iconAST = ast.toExportNamedDeclaration({
      displayName,
      objectExpression: [objectExpression],
    });
    return iconAST;
  };
  const svgCodes = [...sources].map(perFileCode);

  const hasVariableDeclaratorInit =
    (is) =>
    ({
      declaration: {
        declarations: [
          {
            init: { type },
          },
        ],
      },
    }) =>
      type === is;

  const hasArrowFunctionExpression = hasVariableDeclaratorInit(
    "ArrowFunctionExpression"
  );
  const hasCallExpression = hasVariableDeclaratorInit("CallExpression");
  const isNotEmptryString = (str) => str !== "";
  const imports = [
    svgCodes.some(hasArrowFunctionExpression) ? "Icon" : "",
    svgCodes.some(hasCallExpression) ? "createIcon" : "",
  ].filter(isNotEmptryString);
  const program = ast.toSource(
    ast.toImportDeclaration("@chakra-ui/react", ...imports),
    ...svgCodes
  );
  return program;
};

module.exports = {
  createChakraIcon,
};

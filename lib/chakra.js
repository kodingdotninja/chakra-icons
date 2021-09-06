/**
 * @module chakra
 * @description the module for generate Chakra Icon Code.
 */
const SvgParser = require("svg-parser");
const ast = require("./ast");
/**
 * @memberof chakra
 * @name createChakraIcon
 * @param {Object[]} svg
 * @returns {Object}
 * @example
 * createChakraIcon({
 *  isTypescript: false,
 *  displayName: "Hei",
 *  source: `
 *  <svg viewBox=\"0 0 200 200\">
 *    <path
 *      fill="#666"
 *      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
 *    />
 *  </svg>`,
 * })
 */
const createChakraIcon = (...sources) => {
  const isTypescript = sources.some(({ isTypescript }) => isTypescript);
  const perFileCode = ({ source: svg, displayName }) => {
    const hast = SvgParser.parse(svg);

    if (ast.hastChildrenLength(hast) > 1) {
      return ast.hastToComponent(hast, { displayName, isTypescript });
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

  // TODO: make it more accurate with {@babel/types}.isArrowFunctionExpression
  const hasArrowFunctionExpression = hasVariableDeclaratorInit(
    "ArrowFunctionExpression"
  );
  // TODO: make it more accurate with {@babel/types}.isCallExpression
  const hasCallExpression = hasVariableDeclaratorInit("CallExpression");
  const isNotEmptyString = (str) => str !== "";
  // usage for generate import module
  const imports = [
    isTypescript ? "IconProps" : "",
    svgCodes.some(hasArrowFunctionExpression) ? "Icon" : "",
    svgCodes.some(hasCallExpression) ? "createIcon" : "",
  ].filter(isNotEmptyString);
  const program = ast.toSource(
    ast.toImportDeclaration("@chakra-ui/react", ...imports),
    ...svgCodes
  );
  return program;
};

module.exports = {
  createChakraIcon,
};

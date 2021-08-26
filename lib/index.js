const t = require("@babel/types");
///=== BabelAST ===///
function importChakraIcon() {
  const from = t.stringLiteral("@chakra-ui/react");
  const imports = ["createIcon"];
  // @see {https://babeljs.io/docs/en/babel-types#importspecifier}
  const toImportSpecifier = (name) =>
    t.importSpecifier(t.identifier(name), t.identifier(name));
  // @see {https://babeljs.io/docs/en/babel-types#importdeclaration}
  return t.importDeclaration(imports.map(toImportSpecifier), from);
}
function createSourceChakraIcon(statements) {
  return t.program([importChakraIcon(), statements]);
}
/**
 * @typedef {Object} PropsChakraProperties
 * @property {String} displayName
 * @property {String} viewBox
 * @property {String} path
 * @property {String} d
 * @return t.ObjectExpression
 * @see {https://babeljs.io/docs/en/babel-types#objectexpression}
 */
function createChakraProperties(props) {
  const toASTObjectProperty = ([key, value]) =>
    t.objectProperty(
      t.identifier(key),
      // TODO check when value is not string
      t.stringLiteral(value)
    );

  const _props = Object.entries(props).reduce(
    (acc, cur) => [...acc, toASTObjectProperty(cur)],
    []
  );

  return t.objectExpression(_props);
}
/**
 * @typedef {Object} PropsChakraFunctional
 * @property {String} displayName      - Will make as Identifier of your export function name
 * @property {Object} objectExpression - BabelAST for Object Properties Chakra Icon
 * @see {https://babeljs.io/docs/en/babel-types#objectexpression}
 * @return t.ExportNameDeclaration
 * @see {https://babeljs.io/docs/en/babel-types#exportnameddeclaration}
 */
function createChakraFunctional({ displayName, objectExpression }) {
  // @see {https://babeljs.io/docs/en/babel-types#callexpression}
  const createIcon = t.callExpression(
    t.identifier("createIcon"),
    objectExpression
  );
  // @see {https://babeljs.io/docs/en/babel-types#variabledeclarator}
  const variableDeclarator = t.variableDeclarator(
    t.identifier(displayName),
    createIcon
  );
  // @see {https://babeljs.io/docs/en/babel-types#variabledeclaration}
  const variableDeclaration = t.variableDeclaration("const", [
    variableDeclarator,
  ]);
  // @see {https://babeljs.io/docs/en/babel-types#exportnameddeclaration}
  const exportNamedDeclaration = t.exportNamedDeclaration(variableDeclaration);
  return exportNamedDeclaration;
}
///=== HAST ===///
/**
 * example of @param
 * {
 *     type: 'root',
 *     children: [
 *       {
 *         type: 'element',
 *         tagName: 'svg',
 *         properties: { viewBox: '0 0 200 200' },
 *         children: [ [Object], [length]: 1 ],
 *         metadata: '\n  '
 *       },
 *       [length]: 1
 *     ]
 *   }
 * }
 *
 * @param {Object} SVG HAST
 * @typedef {Object} SvgProperties
 * @property {String} d
 * @property {String} viewBox
 * @return {Object} SvgProperties
 *
 */
function hastSVGToChakraProperties({
  children: [
    {
      properties: { viewBox },
      children: [
        {
          properties: { d },
        },
      ],
    },
  ],
}) {
  return {
    viewBox,
    d,
  };
}

module.exports = {
  // BabelAST
  createChakraProperties,
  createChakraFunctional,
  importChakraIcon,
  createSourceChakraIcon,
  // HashAST
  hastSVGToChakraProperties,
};

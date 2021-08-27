const t = require("@babel/types");
/**
 * @namespace api
 * @description the core module of {create-chakra-icons}.
 * @example
 * const {api} = require("create-chakra-icons")
 * // OR
 * const api = require("create-chakra-icons/api")
 *
 * api.importChakraIcon(...)
 */

/**
 * @name api.importChakraIcon
 * @function
 * @exports
 * @param {Undefined}
 * @return {Object} t.importDeclaration @see {@link https://babeljs.io/docs/en/babel-types#importdeclaration|t.importDeclaration}
 */
function importChakraIcon() {
  const from = t.stringLiteral("@chakra-ui/react");
  const imports = ["createIcon"];
  // @see {https://babeljs.io/docs/en/babel-types#importspecifier}
  const toImportSpecifier = (name) =>
    t.importSpecifier(t.identifier(name), t.identifier(name));
  // @see {https://babeljs.io/docs/en/babel-types#importdeclaration}
  return t.importDeclaration(imports.map(toImportSpecifier), from);
}

/**
 * @name api.createSourceChakraIcon
 * @function
 * @exports
 * @param {Object[]} statements
 * @return {Object} t.program @see about {@link https://babeljs.io/docs/en/babel-types#program|t.program}
 */
function createSourceChakraIcon(...statements) {
  return t.program([importChakraIcon(), ...statements]);
}

/**
 * for create an object of @see {@link https://babeljs.io/docs/en/babel-types#objectexpression|t.ObjectExpression}
 * that represent as {@link Object} that will parse in function `createIcon`.
 * @name api.createChakraProperties
 * @function
 * @exports
 * @param {Object} props
 * @property {String} displayName
 * @property {String} viewBox
 * @property {String} [path]
 * @property {String} [d]
 * @return {Object} @see {@link https://babeljs.io/docs/en/babel-types#objectexpression|t.ObjectExpression}
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
 * @name api.createChakraFunctional
 * @function
 * @exports
 * @param {Object} props
 * @property {String} displayName      - Will make as Identifier of your export function name
 * @property {Object} objectExpression @see {@link https://babeljs.io/docs/en/babel-types#objectexpression|t.objectExpression} - BabelAST for Object Properties Chakra Icon
 * @return {Object} @see {@link https://babeljs.io/docs/en/babel-types#exportnameddeclaration|t.ExportNameDeclaration }
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

/**
 * @example
 * // example {Object} that will transform to new Object with properties {viewBox, d}.
 * let sampleHastObject = {
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
 * hastSVGToChakraProperties(sampleHastObject)
 * // example output
 * // {
 * //   viewBox: "0 0 25 25",
 * //   d: "M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
 * // }
 *
 * @name api.hastSVGToChakraProperties
 * @function
 * @exports
 * @param {Object} hastObject
 * @property {String} type
 * @property {Object[]} children
 * @returns {Object}
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

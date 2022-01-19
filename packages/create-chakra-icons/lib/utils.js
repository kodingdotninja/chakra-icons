/**
 * @module utils
 * @description provided utility function.
 */
const { pascalCase, camelCase, snakeCase, constantCase } = require("change-case");

/**
 * @memberof utils
 * @name compose
 * @param {Array}
 * @return {T}
 */
function compose(...args) {
  return (x) => [...args].reduce((_x, fn) => fn(_x), x);
}
/**
 * @memberof utils
 * @name pairToObject
 * @param {Array}
 * @returns {Object}
 */
function pairToObject([key, value]) {
  return { [key]: value };
}
/**
 * @memberof utils
 * @name objectToPair
 * @param {Object}
 * @returns {Array}
 */
function objectToPair(object) {
  return objectToPairs(object)[0];
}
/**
 * @memberof utils
 * @name pairsToObject
 * @param {[String,Any][]} pairs
 * @returns {Object}
 * @example
 * const pairs = [
 *  ["name", "ninja"],
 *  ["from", "japan"],
 * ];
 *
 * const ninjaObject = pairsToObject(pairs)
 * // {
 * // name: "ninja",
 * // from: "japan",
 * // }
 */
function pairsToObject(pairs) {
  return Object.fromEntries(pairs);
}
/**
 * @memberof utils
 * @name objectToPairs
 * @param {Object}
 * @returns {Array}
 */
function objectToPairs(object) {
  return Object.entries(object);
}
/**
 *
 * @memberof utils
 * @name stringToCase
 * @param {String} str
 * @param {String} [_case="pascal"] - case style "camel" | "constant" | "snake"
 * @returns {String}
 * @example
 * const str = "Hei"
 * stringToCase(str, "constant")
 * // HEI
 */
function stringToCase(str, _case) {
  return {
    [true]: pascalCase(str),
    [_case === "camel"]: camelCase(str),
    [_case === "constant"]: constantCase(str),
    [_case === "snake"]: snakeCase(str),
  }.true;
}

module.exports = {
  pairToObject,
  objectToPair,
  pairsToObject,
  objectToPairs,
  compose,
  stringToCase,
};

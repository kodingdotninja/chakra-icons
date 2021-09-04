/**
 * @module utils
 * @description provided utility function.
 */
/**
 * @memberof utils
 * @name compose
 * @param {Array}
 * @return {T}
 */
const compose =
  (...args) =>
  (x) =>
    [...args].reduce((_x, fn) => fn(_x), x);
/**
 * @memberof utils
 * @name pairToObject
 * @param {Array}
 * @returns {Object}
 */
const pairToObject = ([key, value]) => ({ [key]: value });
/**
 * @memberof utils
 * @name objectToPair
 * @param {Object}
 * @returns {Array}
 */
const objectToPair = (object) => objectToPairs(object)[0];
/**
 * @memberof utils
 * @name pairsToObject
 * @param {Array}
 * @returns {Object}
 */
const pairsToObject = (pairs) => Object.fromEntries(pairs);
/**
 * @memberof utils
 * @name objectToPairs
 * @param {Object}
 * @returns {Array}
 */
const objectToPairs = (object) => Object.entries(object);

module.exports = {
  pairToObject,
  objectToPair,
  pairsToObject,
  objectToPairs,
  compose,
};

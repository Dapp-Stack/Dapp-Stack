import snakeCase from "lodash/snakeCase";

function camelToUpperSnakeCase(str) {
  return snakeCase(str).toUpperCase();
}

export { camelToUpperSnakeCase as formatName };

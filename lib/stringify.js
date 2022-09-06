"use strict";

const { encodeString } = require("./internals/querystring");

function getAsPrimitive(value) {
  const type = typeof value;

  if (type === "string") {
    // Length check is handled inside encodeString function
    return encodeString(value);
  } else if (type === "bigint") {
    return value + "";
  } else if (type === "boolean") {
    return value ? "true" : "false";
  } else if (type === "number" && Number.isFinite(value)) {
    if (Math.abs(value) < 1e21) return value + "";
    return encodeString(value + "");
  }

  return "";
}

/**
 * @callback
 * @param {any} input
 * @return {string}
 */
function stringify(input) {
  let result = "";

  if (input === null || typeof input !== "object") {
    return result;
  }

  const keys = Object.getOwnPropertyNames(input);
  const keyLength = keys.length;
  const separator = "&";
  let valueLength = 0;

  for (let i = 0; i < keyLength; i++) {
    const key = keys[i];
    const value = input[key];
    const encodedKey = encodeString(key) + "=";

    if (i) {
      result += separator;
    }

    if (Array.isArray(value)) {
      valueLength = value.length;
      for (let j = 0; j < valueLength; j++) {
        if (j) {
          result += separator;
        }

        // Optimization: Dividing into multiple lines improves the performance.
        // Since v8 does not need to care about the '+' character if it was one-liner.
        result += encodedKey;
        result += getAsPrimitive(value[j]);
      }
    } else {
      result += encodedKey;
      result += getAsPrimitive(value);
    }
  }

  return result;
}

module.exports = stringify;

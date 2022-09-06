"use strict";

const fastDecode = require("fast-decode-uri-component");

/**
 * @callback parse
 * @param {string} input
 */
function parse(input) {
  const result = Object.create(null);

  if (typeof input !== "string") {
    return result;
  }

  const inputLength = input.length;
  let key = "";
  let value = "";
  let startingIndex = -1;
  let equalityIndex = -1;
  let shouldDecodeKey = false;
  let shouldDecodeValue = false;
  let keyHasPlus = false;
  let valueHasPlus = false;
  let hasBothKeyValuePair = false;
  let keyEndingIndex = 0;

  // Have a boundary of input.length + 1 to access last pair inside the loop.
  for (let i = 0; i < inputLength + 1; i++) {
    let c = i !== inputLength ? input.charCodeAt(i) : -1;

    // Handle '&' and end of line to pass the current values to result
    if (c === 38 || c === -1) {
      hasBothKeyValuePair = equalityIndex > startingIndex;
      keyEndingIndex = hasBothKeyValuePair ? equalityIndex : i;

      key = input.slice(startingIndex + 1, keyEndingIndex);

      // Check if the current range consist of a single key
      if (hasBothKeyValuePair) {
        value = input.slice(equalityIndex + 1, i);
      }

      // Add key/value pair only if the range size is greater than 1; a.k.a. contains at least "="
      if (hasBothKeyValuePair || i - startingIndex > 1) {
        // Optimization: Replace '+' with space
        if (keyHasPlus) {
          key = key.replaceAll("+", " ");
        }

        // Optimization: Do not decode if it's not necessary.
        if (shouldDecodeKey) {
          key = fastDecode(key) || key;
        }

        if (hasBothKeyValuePair) {
          if (valueHasPlus) {
            value = value.replaceAll("+", " ");
          }

          if (shouldDecodeValue) {
            value = fastDecode(value) || value;
          }
        }

        if (result[key] === undefined) {
          result[key] = value;
        } else {
          const currentValue = result[key];

          if (currentValue.pop) {
            currentValue.push(value);
          } else {
            result[key] = [currentValue, value];
          }
        }
      }

      // Reset reading key value pairs
      key = "";
      value = "";
      startingIndex = i;
      equalityIndex = i;
      shouldDecodeKey = false;
      shouldDecodeValue = false;
      keyHasPlus = false;
      valueHasPlus = false;
      hasBothKeyValuePair = false;
    }
    // Check '='
    else if (c === 61) {
      // If '=' character occurs again, we should decode the input.
      if (equalityIndex > startingIndex) {
        shouldDecodeValue = true;
      } else {
        equalityIndex = i;
      }
    }
    // Check '+', and replace it with empty space.
    else if (c === 43) {
      if (equalityIndex <= startingIndex) {
        keyHasPlus = true;
      } else {
        valueHasPlus = true;
      }
    }
    // Check '%' character for encoding
    else if (c === 37) {
      if (equalityIndex <= startingIndex) {
        shouldDecodeKey = true;
      } else {
        shouldDecodeValue = true;
      }
    }
  }

  return result;
}

module.exports = parse;

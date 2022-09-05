"use strict";

const errors = require("./errors");

/**
 * @callback parse
 * @param {string} input
 */
function parse(input) {
  if (typeof input !== "string") {
    throw errors.codes.FST_QS_INVALID_INPUT;
  }
  const result = Object.create(null);

  let key = "";
  let value = "";
  let separatorIndex = 0;
  let equalityIndex = 0;
  let shouldEncode = false;
  let hasPlus = false;

  // Have a boundary of input.length + 1 to access last pair inside the loop.
  for (let i = 0; i < input.length + 1; i++) {
    let c = input.charCodeAt(i);

    // Handle '&' and end of line to pass the current values to result
    if (c === 38 || isNaN(c)) {
      const hasOnlyKey = equalityIndex <= separatorIndex;
      const keySize =
        hasOnlyKey ? i - separatorIndex : equalityIndex - separatorIndex;

      if (keySize > 0) {
        // Accept empty values, if key size is positive
        if (hasOnlyKey) {
          key = input.slice(separatorIndex, i);
          value = "";
        } else {
          key = input.slice(separatorIndex, equalityIndex);
          value = input.slice(equalityIndex + 1, i);
        }

        // Optimization: Replace '+' with space
        if (hasPlus) {
          key = key.replace(/\+/g, " ");
          value = value.replace(/\+/g, " ");
        }

        // Optimization: Do not decode if it's not necessary.
        if (shouldEncode) {
          key = decodeURIComponent(key);
          value = decodeURIComponent(value);
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
      separatorIndex = i + 1;
      equalityIndex = i + 1;
      shouldEncode = false;
      hasPlus = false;
    }
    // Check '='
    else if (c === 61) {
      equalityIndex = i;
    }
    // Check '+', and replace it with empty space.
    else if (c === 43) {
      hasPlus = true;
    }
    // Check '%' character for encoding
    else if (c === 37) {
      shouldEncode = true;
    }
  }

  return result;
}

module.exports = parse;

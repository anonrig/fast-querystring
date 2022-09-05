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

  let key = "";
  let value = "";
  let startingIndex = -1;
  let equalityIndex = -1;
  let shouldDecode = false;
  let hasPlus = false;
  const lastIndex = input.length;

  // Have a boundary of input.length + 1 to access last pair inside the loop.
  for (let i = 0; i < lastIndex + 1; i++) {
    let c = (i !== lastIndex && input.charCodeAt(i)) || -1;

    // Handle '&' and end of line to pass the current values to result
    if (c === 38 || c === -1) {
      // Check if the current range consist of a single key
      if (equalityIndex <= startingIndex) {
        key = input.slice(startingIndex + 1, i);
        value = "";
      }
      // Range consist of both key and value
      else {
        key = input.slice(startingIndex + 1, equalityIndex);
        value = input.slice(equalityIndex + 1, i);
      }

      // Add key/value pair only if the range size is greater than 1; a.k.a. contains at least "="
      if (i - startingIndex > 1) {
        // Optimization: Replace '+' with space
        if (hasPlus) {
          key = key.replaceAll("+", " ");
          value = value.replaceAll("+", " ");
        }

        // Optimization: Do not decode if it's not necessary.
        if (shouldDecode) {
          key = fastDecode(key) || key;
          value = fastDecode(value) || value;
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
      shouldDecode = false;
      hasPlus = false;
    }
    // Check '='
    else if (c === 61) {
      // If '=' character occurs again, we should decode the input.
      if (equalityIndex > startingIndex) {
        shouldDecode = true;
      } else {
        equalityIndex = i;
      }
    }
    // Check '+', and replace it with empty space.
    else if (c === 43) {
      hasPlus = true;
    }
    // Check '%' character for encoding
    else if (c === 37) {
      shouldDecode = true;
    }
  }

  return result;
}

module.exports = parse;

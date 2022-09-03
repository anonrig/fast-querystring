"use strict";

/**
 * @callback parse
 * @param {string} input
 */
function parse(input) {
  const result = Object.create(null);

  let key = "";
  let value = "";
  let separatorIndex = 0;
  let equalityIndex = 0;
  let shouldEncode = false;

  // Have a boundary of input.length + 1 to access last pair inside the loop.
  for (let i = 0; i < input.length + 1; i++) {
    let c = input.charCodeAt(i);

    // Handle '&' and end of line to pass the current values to result
    if (c === 38 || isNaN(c)) {
      // Disallow empty key values.
      if (equalityIndex - separatorIndex > 0 && i - equalityIndex + 1 > 0) {
        key = input.slice(separatorIndex, equalityIndex);
        value = input.slice(equalityIndex + 1, i);

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
      separatorIndex = i + 1;
      equalityIndex = i + 1;
    }
    // Handle equal operator
    else if (c === 61) {
      equalityIndex = i;
    }
    // Check '+', and replace it with empty space.
    else if (c === 43) {
      input[i] = " ";
    } else {
      // Check '%' character for encoding
      if (c === 37) {
        shouldEncode = true;
      }
    }
  }

  return result;
}

module.exports = parse;
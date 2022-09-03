"use strict";

/**
 * @callback parse
 * @param {string} input
 */
function parse(input) {
  let result = Object.create(null);

  let currentKey = "";
  let currentValue = "";
  let seenEqualOperator = false;

  // Have a boundary of input.length + 1 to access last pair inside the loop.
  for (let i = 0; i < input.length + 1; i++) {
    let c = input.charCodeAt(i);

    // Handle '&' and end of line to pass the current values to result
    if (c === 38 || isNaN(c)) {
      // Disallow empty key values.
      if (currentKey.length === 0) {
        continue
      } else if (typeof result[currentKey] === "undefined") {
        result[currentKey] = currentValue;
      } else if (Array.isArray(result[currentKey])) {
        result[currentKey].push(currentValue);
      } else {
        result[currentKey] = [result[currentKey], currentValue];
      }

      // Reset reading key value pairs
      currentKey = "";
      currentValue = "";
      seenEqualOperator = false;
    }
    // Handle equal operator
    else if (c === 61) {
      seenEqualOperator = true;
    } else {
      if (seenEqualOperator) {
        currentValue += input[i];
      } else {
        currentKey += input[i];
      }
    }
  }

  return result;
}

module.exports = parse;

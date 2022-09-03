"use strict";

/**
 * @callback parse
 * @param {string} input
 */
function parse(input) {
  let result = Object.create(null);

  let currentKey = [""];
  let currentValue = "";
  let currentPairIsArray = false;
  let seenEqualOperator = false;

  // Have a boundary of input.length + 1 to access last pair inside the loop.
  for (let i = 0; i < input.length + 1; i++) {
    let currentCharacter = input.charCodeAt(i);
    let currentKeyLength = currentKey.length;

    if (isNaN(currentCharacter)) {
      currentCharacter = 38;
    }

    switch (currentCharacter) {
      // &
      case 38: {
        let root = result;

        for (let k = 0; k < currentKeyLength; k++) {
          let key = currentKey[k];

          if (typeof root[key] === "undefined") {
            if (k === currentKeyLength - 1) {
              if (currentPairIsArray) {
                root[key] = [currentValue];
              } else {
                root[key] = currentValue;
              }
            } else {
              root[key] = {};
              root = root[key];
            }
          } else if (Array.isArray(root[key])) {
            root[key].push(currentValue);
          } else if (k === currentKeyLength - 1) {
            root[key] = [root[key], currentValue];
          } else {
            Object.assign(root[key], { [key]: {} });
          }
        }

        // Reset reading key value pairs
        currentKey = [""];
        currentValue = "";
        seenEqualOperator = false;
        currentPairIsArray = false;
        break;
      }
      // ']'
      case 93: {
        // Ignore ']' character, since it's already handled inside '['.
        break;
      }
      // '['
      case 91: {
        let nextCharacter = input.charCodeAt(i + 1);

        // Check if input is an array. Example: hello[]=world equals to { hello: ['world'] }
        if (nextCharacter === 93) {
          currentPairIsArray = true;
          i++;
        }
        // Check push a new key to keys. Only applicable when key is not an array, but consists of length > 0.
        else {
          currentKey.push("");
        }

        break;
      }
      // '='
      case 61: {
        seenEqualOperator = true;
        break;
      }
      default: {
        if (seenEqualOperator) {
          currentValue += input[i];
        } else {
          currentKey[currentKeyLength - 1] += input[i];
        }
      }
    }
  }

  return result;
}

module.exports = parse;

"use strict";

const decodeMap = new Int8Array([
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, // 0-15
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, // 16-31
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, // 32-47
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, -1, -1, -1, -1, -1, -1, // 48-63 (0-9)
  -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1, // 64-79 (A-F)
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, // 80-95
  -1, 10, 11, 12, 13, 14, 15, -1, -1, -1, -1, -1, -1, -1, -1, -1, // 96-111 (a-f)
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, // 112-127
]);

/**
 * Fast URI component decoder that avoids exceptions
 * @param {string} str
 * @returns {string | null}
 */
function fastDecode(str) {
  const len = str.length;
  if (len === 0) return str;

  let out = "";
  let lastPos = 0;
  let i = 0;

  while (i < len) {
    const c = str.charCodeAt(i);
    if (c === 37) { // '%'
      // Check bounds
      if (i + 2 >= len) return null;

      const c1 = str.charCodeAt(i + 1);
      const c2 = str.charCodeAt(i + 2);

      // Validate and decode hex
      const h1 = c1 < 128 ? decodeMap[c1] : -1;
      const h2 = c2 < 128 ? decodeMap[c2] : -1;

      if (h1 === -1 || h2 === -1) return null;

      const byte = (h1 << 4) | h2;

      // Handle multi-byte UTF-8 sequences
      if (byte < 0x80) {
        // Single byte character
        if (lastPos < i) out += str.slice(lastPos, i);
        out += String.fromCharCode(byte);
        lastPos = i + 3;
        i += 3;
      } else if (byte < 0xE0) {
        // 2-byte sequence
        if (i + 5 >= len) return null;
        if (str.charCodeAt(i + 3) !== 37) return null;
        const c3 = str.charCodeAt(i + 4);
        const c4 = str.charCodeAt(i + 5);
        const h3 = c3 < 128 ? decodeMap[c3] : -1;
        const h4 = c4 < 128 ? decodeMap[c4] : -1;
        if (h3 === -1 || h4 === -1) return null;
        const byte2 = (h3 << 4) | h4;
        if (lastPos < i) out += str.slice(lastPos, i);
        out += String.fromCharCode(((byte & 0x1F) << 6) | (byte2 & 0x3F));
        lastPos = i + 6;
        i += 6;
      } else if (byte < 0xF0) {
        // 3-byte sequence
        if (i + 8 >= len) return null;
        if (str.charCodeAt(i + 3) !== 37 || str.charCodeAt(i + 6) !== 37) return null;
        const c3 = str.charCodeAt(i + 4);
        const c4 = str.charCodeAt(i + 5);
        const c5 = str.charCodeAt(i + 7);
        const c6 = str.charCodeAt(i + 8);
        const h3 = c3 < 128 ? decodeMap[c3] : -1;
        const h4 = c4 < 128 ? decodeMap[c4] : -1;
        const h5 = c5 < 128 ? decodeMap[c5] : -1;
        const h6 = c6 < 128 ? decodeMap[c6] : -1;
        if (h3 === -1 || h4 === -1 || h5 === -1 || h6 === -1) return null;
        const byte2 = (h3 << 4) | h4;
        const byte3 = (h5 << 4) | h6;
        if (lastPos < i) out += str.slice(lastPos, i);
        out += String.fromCharCode(((byte & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F));
        lastPos = i + 9;
        i += 9;
      } else {
        // 4-byte sequence - need surrogate pair
        if (i + 11 >= len) return null;
        if (str.charCodeAt(i + 3) !== 37 || str.charCodeAt(i + 6) !== 37 || str.charCodeAt(i + 9) !== 37) return null;
        // For simplicity with 4-byte sequences, fall back to decodeURIComponent
        try {
          if (lastPos < i) out += str.slice(lastPos, i);
          out += decodeURIComponent(str.slice(i, i + 12));
          lastPos = i + 12;
          i += 12;
        } catch {
          return null;
        }
      }
    } else {
      i++;
    }
  }

  if (lastPos === 0) return str;
  if (lastPos < len) return out + str.slice(lastPos);
  return out;
}

const plusRegex = /\+/g;
const Empty = function () {};
Empty.prototype = Object.create(null);

/**
 * @callback parse
 * @param {string} input
 */
function parse(input) {
  // Optimization: Use new Empty() instead of Object.create(null) for performance
  // v8 has a better optimization for initializing functions compared to Object
  const result = new Empty();

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
  let c = 0;

  // Have a boundary of input.length + 1 to access last pair inside the loop.
  for (let i = 0; i < inputLength + 1; i++) {
    c = i !== inputLength ? input.charCodeAt(i) : 38;

    // Handle '&' and end of line to pass the current values to result
    if (c === 38) {
      hasBothKeyValuePair = equalityIndex > startingIndex;

      // Optimization: Reuse equality index to store the end of key
      if (!hasBothKeyValuePair) {
        equalityIndex = i;
      }

      key = input.slice(startingIndex + 1, equalityIndex);

      // Add key/value pair only if the range size is greater than 1; a.k.a. contains at least "="
      if (hasBothKeyValuePair || key.length > 0) {
        // Optimization: Replace '+' with space
        if (keyHasPlus) {
          key = key.replace(plusRegex, " ");
        }

        // Optimization: Do not decode if it's not necessary.
        if (shouldDecodeKey) {
          key = fastDecode(key) || key;
        }

        if (hasBothKeyValuePair) {
          value = input.slice(equalityIndex + 1, i);

          if (valueHasPlus) {
            value = value.replace(plusRegex, " ");
          }

          if (shouldDecodeValue) {
            value = fastDecode(value) || value;
          }
        }
        const currentValue = result[key];

        if (currentValue === undefined) {
          result[key] = value;
        } else {
          // Optimization: value.pop is faster than Array.isArray(value)
          if (currentValue.pop) {
            currentValue.push(value);
          } else {
            result[key] = [currentValue, value];
          }
        }
      }

      // Reset reading key value pairs
      value = "";
      startingIndex = i;
      equalityIndex = i;
      shouldDecodeKey = false;
      shouldDecodeValue = false;
      keyHasPlus = false;
      valueHasPlus = false;
    }
    // Check '='
    else if (c === 61) {
      if (equalityIndex <= startingIndex) {
        equalityIndex = i;
      }
      // If '=' character occurs again, we should decode the input.
      else {
        shouldDecodeValue = true;
      }
    }
    // Check '+', and remember to replace it with empty space.
    else if (c === 43) {
      if (equalityIndex > startingIndex) {
        valueHasPlus = true;
      } else {
        keyHasPlus = true;
      }
    }
    // Check '%' character for encoding
    else if (c === 37) {
      if (equalityIndex > startingIndex) {
        shouldDecodeValue = true;
      } else {
        shouldDecodeKey = true;
      }
    }
  }

  return result;
}

module.exports = parse;

"use strict";
/**
 * @function is_c0_control_percent_encoded
 * @description
 * The C0 control percent-encode set are the C0 controls and all code points greater than U+007E (~).
 * A C0 control is a code point in the range U+0000 NULL to U+001F INFORMATION SEPARATOR ONE, inclusive.
 *
 * [Specification]{@link https://url.spec.whatwg.org/#c0-control-percent-encode-set}
 *
 * @param {number} code_point
 * @returns {boolean}
 */
function is_c0_control_percent_encoded(code_point) {
  return code_point <= 0x1F || code_point > 0x7E;
}

const query_percent_encodes = {
  0x20: true,
  0x22: true,
  0x23: true,
  0x3C: true,
  0x3E: true,
};

/**
 * @function is_query_percent_encoded
 * @description The query percent-encode set is the C0 control percent-encode set and U+0020 SPACE, U+0022 ("),
 * U+0023 (#), U+003C (<), and U+003E (>).
 * [Specification]{@link https://url.spec.whatwg.org/#query-percent-encode-set}
 * @param {number} code
 * @returns {boolean}
 */
function is_query_percent_encoded(code) {
  return (
    typeof query_percent_encodes[
      code
    ] !== "undefined" || is_c0_control_percent_encoded(code)
  );
}

/**
 * @function percent_encode
 * @description To percent-encode a byte, return a string consisting of U+0025 (%), followed by two ASCII upper hex digits representing byte.
 * [Specification]{@link https://url.spec.whatwg.org/#percent-encode}
 * @param {number} code
 * @returns {string}
 */
function percent_encode(code) {
  const hex = code.toString(16).toUpperCase();

  if (hex.length === 1) {
    return `%0${hex}`;
  }

  return `%${hex}`;
}

/**
 * @function is_special_query_percent_encoded
 * [Specification]{@link https://url.spec.whatwg.org/#special-query-percent-encode-set}
 * @param {number} code
 * @returns {boolean}
 */
function is_special_query_percent_encoded(code) {
  return code === 39 || is_query_percent_encoded(code);
}

module.exports = {
  is_special_query_percent_encoded,
  percent_encode,
};

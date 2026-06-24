"use strict";

/**
 * Lenient percent-decoder used only as a fallback when the fast path
 * (`fast-decode-uri-component`) returns `null` for input that contains a
 * syntactically valid percent-escape that is not valid UTF-8.
 *
 * It mirrors how `node:querystring` decodes such a token: when at least one
 * decodable `%XX` escape is present, every code unit is masked to a single
 * byte, escapes contribute their byte, and invalid byte sequences become
 * U+FFFD (instead of being left as the raw "%XX" text). When the token has
 * no decodable escape (only malformed ones such as "%zz"), it is returned
 * unchanged, exactly as node:querystring leaves it.
 *
 * @param {string} str
 * @returns {string}
 */
function decodeString(str) {
  const len = str.length;
  const buf = Buffer.allocUnsafe(len);
  let bufLen = 0;
  let hasEscape = false;

  for (let i = 0; i < len; i++) {
    const c = str.charCodeAt(i);

    if (c === 37 /* % */ && i + 2 < len) {
      const hi = hexValue(str.charCodeAt(i + 1));
      const lo = hexValue(str.charCodeAt(i + 2));

      if (hi !== -1 && lo !== -1) {
        buf[bufLen++] = (hi << 4) | lo;
        hasEscape = true;
        i += 2;
        continue;
      }
    }

    buf[bufLen++] = c & 0xff;
  }

  // No decodable escape: node:querystring returns the token untouched.
  if (!hasEscape) return str;

  return buf.toString("utf8", 0, bufLen);
}

function hexValue(c) {
  if (c >= 48 && c <= 57) return c - 48; // 0-9
  if (c >= 65 && c <= 70) return c - 55; // A-F
  if (c >= 97 && c <= 102) return c - 87; // a-f
  return -1;
}

module.exports = { decodeString };

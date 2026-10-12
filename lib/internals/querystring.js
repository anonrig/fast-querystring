// This file is taken from Node.js project.
// Full implementation can be found from https://github.com/nodejs/node/blob/main/lib/internal/querystring.js

const hexTable = Array.from(
  { length: 256 },
  (_, i) => "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase(),
);

// These characters do not need escaping when generating query strings:
// ! - . _ ~
// ' ( ) *
// digits
// alpha (uppercase)
// alpha (lowercase)
// biome-ignore format: the array should not be formatted
const noEscape = new Int8Array([
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
  0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 0, // 32 - 47
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, // 80 - 95
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, // 112 - 127
]);

const needEscape = /[^A-Za-z0-9!\-.~'()*]/;
// Below this length the tight per-character scanning loop is faster than a
// native regex pre-scan, because the regex call overhead dominates for short
// inputs. Above it, escaping only the tail is a clear win.
const SHORT_STRING_LENGTH = 16;

/**
 * @param {string} str
 * @returns {string}
 */
function encodeString(str) {
  const len = str.length;
  if (len === 0) return "";

  // Fast path: for short strings we scan every character with a tight loop. For
  // longer ones we first use a native regex scan to find the first character
  // that needs escaping. When the whole string is already safe (the common case
  // for already-escaped values) we can return it unchanged without the loop, and
  // otherwise we resume the loop right where escaping starts.
  const firstEscape = len < SHORT_STRING_LENGTH ? 0 : str.search(needEscape);
  if (firstEscape === -1) return str;

  let out = len < SHORT_STRING_LENGTH ? "" : str.slice(0, firstEscape);
  let lastPos = firstEscape;
  let i = firstEscape;

  outer: for (; i < len; i++) {
    let c = str.charCodeAt(i);

    // ASCII
    while (c < 0x80) {
      if (noEscape[c] !== 1) {
        if (lastPos < i) out += str.slice(lastPos, i);
        lastPos = i + 1;
        out += hexTable[c];
      }

      if (++i === len) break outer;

      c = str.charCodeAt(i);
    }

    if (lastPos < i) out += str.slice(lastPos, i);

    // Multi-byte characters ...
    if (c < 0x800) {
      lastPos = i + 1;
      out += hexTable[0xc0 | (c >> 6)] + hexTable[0x80 | (c & 0x3f)];
      continue;
    }
    if (c < 0xd800 || c >= 0xe000) {
      lastPos = i + 1;
      out +=
        hexTable[0xe0 | (c >> 12)] +
        hexTable[0x80 | ((c >> 6) & 0x3f)] +
        hexTable[0x80 | (c & 0x3f)];
      continue;
    }
    // Surrogate pair
    ++i;

    // This branch should never happen because all URLSearchParams entries
    // should already be converted to USVString. But, included for
    // completion's sake anyway.
    if (i >= len) {
      throw new Error("URI malformed");
    }

    const c2 = str.charCodeAt(i) & 0x3ff;

    lastPos = i + 1;
    c = 0x10000 + (((c & 0x3ff) << 10) | c2);
    out +=
      hexTable[0xf0 | (c >> 18)] +
      hexTable[0x80 | ((c >> 12) & 0x3f)] +
      hexTable[0x80 | ((c >> 6) & 0x3f)] +
      hexTable[0x80 | (c & 0x3f)];
  }
  if (lastPos === 0) return str;
  if (lastPos < len) return out + str.slice(lastPos);
  return out;
}

module.exports = { encodeString };

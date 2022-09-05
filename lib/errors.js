function createError(name, message) {
  const error = new Error();
  error.message = message;
  error.name = name;
  return error;
}
const codes = {
  FST_QS_INVALID_INPUT: createError("FST_QS_INVALID_INPUT", "Invalid Input"),
};

module.exports = {
  codes,
};

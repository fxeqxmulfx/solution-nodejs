function getEnv(env, defaultValue) {
  const value = process.env[env];
  if (value == null && defaultValue == null) {
    throw new Error(`ENV ${env} is not set`);
  }
  if (value == null) {
    return defaultValue;
  }
  return value;
}

function isNumeric(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

function getEnvInt(env, defaultValue) {
  const value = process.env[env];
  if (value == null && defaultValue == null) {
    throw new Error(`ENV ${env} is not set`);
  }
  if (value == null || !isNumeric(value)) {
    return defaultValue;
  }
  return Number.parseInt(value);
}

module.exports = { getEnv, getEnvInt };

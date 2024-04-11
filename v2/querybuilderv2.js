/**
 * @returns {Object} - Object with key value pairs matching array indices ["name", "george"] returns {"name": "george"}
 * @param args
 */
export const arrayToObjectBuilder = (...args) => {
  let obj = {};
  for (let i = 0; i < args.length; i += 2) {
    obj[args[i]] = args[i + 1];
  }
  return obj;
}

/**
 * @param {Object} obj - Object that will deconstruct key value pairs into query params
 * @returns {string} - The tail end of the url with the key value queries
 */
export const generateDeviggerUrl = (obj) => {
  let stringToAppend = "";
  for (const key in obj) {
    stringToAppend += key + "=" + obj[key] + "&";
  }
  return stringToAppend;
}


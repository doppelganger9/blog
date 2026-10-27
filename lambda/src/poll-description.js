const { describeTable } = require("./airtable-poll-api");
const { corsHeaders, isForbiddenOrigin, json } = require('./utils/http');

const ALLOWED_METHODS = 'GET';

/**
 * Netlify Function REST API for Poll table descriptions.
 *
 * @param {*} event
 * @returns
 */
exports.handler = async event => {
  if (isForbiddenOrigin(event)) {
    return json(event, ALLOWED_METHODS, 403, { message: 'Forbidden' });
  }

  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 204,
        headers: corsHeaders(event, ALLOWED_METHODS),
        body: ''
      };
    } else if (event.httpMethod === 'GET') {
      const tableDescription = await describeTable();
      return json(event, ALLOWED_METHODS, 200, tableDescription);
    } else {
      return json(event, ALLOWED_METHODS, 405, { message: 'Method not allowed' });
    }

  } catch (e) {
    console.error(e);
    return json(event, ALLOWED_METHODS, 500, { message: 'Internal Server Error' });
  }
};

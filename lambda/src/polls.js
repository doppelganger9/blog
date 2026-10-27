const { getAnswers, saveAnswer } = require('./airtable-poll-api');
const { corsHeaders, isForbiddenOrigin, json } = require('./utils/http');

const ALLOWED_METHODS = 'POST,GET';

// Lettres, chiffres, espace et . _ @ - : pas de guillemets ni d'antislash, la valeur est réutilisée dans une formule Airtable.
const USER_IDENTIFIER_PATTERN = /^[\p{L}\p{N} ._@-]{1,64}$/u;
const MAX_ANSWER_LENGTH = 100;

/**
 * Valide et normalise le corps d'un POST.
 * @param {string|null} rawBody
 * @returns {{userIdentifier: string, answer: string}|null}
 */
function parseAnswer(rawBody) {
  let data;
  try {
    data = JSON.parse(rawBody || '');
  } catch (e) {
    return null;
  }
  const userIdentifier = typeof data?.userIdentifier === 'string' ? data.userIdentifier.trim() : '';
  const answer = typeof data?.answer === 'string' ? data.answer.trim() : '';
  if (!USER_IDENTIFIER_PATTERN.test(userIdentifier) || !answer || answer.length > MAX_ANSWER_LENGTH) {
    return null;
  }
  return { userIdentifier, answer };
}

/**
 * Netlify Function REST API for Polls.
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
      // on n'expose que les réponses, jamais les identifiants des votants
      const answers = await getAnswers();
      return json(event, ALLOWED_METHODS, 200, answers.map(({ answer }) => ({ answer })));
    } else if (event.httpMethod === 'POST') {
      const data = parseAnswer(event.body);
      if (!data) {
        return json(event, ALLOWED_METHODS, 400, { message: 'Bad Request' });
      }

      await saveAnswer(data);

      return json(event, ALLOWED_METHODS, 200, { message: "Réponse sauvegardée" });
    } else {
      return json(event, ALLOWED_METHODS, 405, { message: 'Method not allowed' });
    }

  } catch (e) {
    console.error(e);
    return json(event, ALLOWED_METHODS, 500, { message: 'Internal Server Error' });
  }
};

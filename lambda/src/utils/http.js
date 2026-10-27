//@ts-check

/**
 * Helpers HTTP partagés par les Netlify Functions : CORS restreint et réponses.
 *
 * NOTE: ce dossier ne contient ni `utils.js` ni `index.js`, Netlify ne le déploie donc pas comme une fonction.
 */

const DEFAULT_ALLOWED_ORIGINS = [
  /^https:\/\/lacourt\.dev$/,
  // deploy previews / branch deploys Netlify
  /^https:\/\/([a-z0-9-]+--)?infallible-shannon-2d54c6\.netlify\.app$/,
  // dev local (vite dev / preview / netlify dev)
  /^http:\/\/(localhost|127\.0\.0\.1):\d+$/,
];

/**
 * Origines autorisées, surchargeables via la variable d'environnement ALLOWED_ORIGINS
 * (liste d'origines exactes séparées par des virgules).
 * @returns {(string|RegExp)[]}
 */
function allowedOrigins() {
  const fromEnv = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ALLOWED_ORIGINS;
}

/**
 * @param {string|undefined} origin
 * @returns {boolean}
 */
function isAllowedOrigin(origin) {
  if (!origin) {
    return false;
  }
  return allowedOrigins().some(allowed => typeof allowed === 'string' ? allowed === origin : allowed.test(origin));
}

/**
 * L'en-tête Origin de la requête, quelle que soit sa casse.
 * @param {any} event
 * @returns {string|undefined}
 */
function getOrigin(event) {
  const headers = event.headers || {};
  return headers.origin || headers.Origin;
}

/**
 * Une requête est refusée si elle vient d'une origine présente mais non autorisée.
 * Les requêtes same-origin en GET n'envoient pas toujours d'en-tête Origin : on les accepte.
 * @param {any} event
 * @returns {boolean}
 */
function isForbiddenOrigin(event) {
  const origin = getOrigin(event);
  return !!origin && !isAllowedOrigin(origin);
}

/**
 * En-têtes CORS : on ne renvoie Access-Control-Allow-Origin que pour une origine autorisée.
 * @param {any} event
 * @param {string} allowedMethods
 */
function corsHeaders(event, allowedMethods) {
  const origin = getOrigin(event);
  return {
    'Access-Control-Allow-Methods': allowedMethods,
    'Access-Control-Allow-Headers': 'content-type',
    'Vary': 'Origin',
    ...(isAllowedOrigin(origin) && { 'Access-Control-Allow-Origin': origin }),
  };
}

/**
 * @param {any} event
 * @param {string} allowedMethods
 * @param {number} statusCode
 * @param {any} body objet sérialisé en JSON
 */
function json(event, allowedMethods, statusCode, body) {
  return {
    statusCode,
    headers: {
      ...corsHeaders(event, allowedMethods),
      'Content-Type': 'application/json;charset=UTF-8',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body),
  };
}

module.exports = {
  isAllowedOrigin,
  isForbiddenOrigin,
  corsHeaders,
  json,
};

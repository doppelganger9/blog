const { getAnswers, saveAnswer } = require('./airtable-poll-api');

/**
 * Netlify Function REST API for Polls.
 * @param {*} event 
 * @returns 
 */
exports.handler = async event => {
  try {
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          "access-control-allow-method": "POST,GET",
          "access-control-allow-headers": "content-type",
          ...(event.headers.origin && {"Access-Control-Allow-Origin": event.headers.origin}),
        },
        body: ''
      };
    } else if (event.httpMethod === 'GET') {
      const body = JSON.stringify(await getAnswers());
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          ...(event.headers.origin && {"Access-Control-Allow-Origin": event.headers.origin}),
        },
        body
      };
    } else if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
    
      await saveAnswer(data);
  
      return {
        statusCode: 200,
        headers: {
          ...(event.headers.origin && {"Access-Control-Allow-Origin": event.headers.origin}),
        },
        body: JSON.stringify({
          message: "Réponse sauvegardée"
        })
      };
    } else {
      return {
        statusCode: 405,
        headers: {
          "access-control-allow-method": "POST,GET",
          "access-control-allow-headers": "content-type",
          ...(event.headers.origin && {"Access-Control-Allow-Origin": event.headers.origin}),
        },
        body: 'Method not allowed'
      };
    }


  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      headers: {
        ...(event.headers.origin && {"Access-Control-Allow-Origin": event.headers.origin}),
      },
      body: e.message ? e.message : e
    };
  }
};
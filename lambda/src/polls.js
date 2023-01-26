const Airtable = require('airtable');

/**
 * nécessite d'avoir positionner les variables d'environnements suivantes:
 * 
 * - AT_API_KEY
 * - AT_BASE
 * - AT_TABLE
 * 
 * Ces variables sont sensibles, ne pas les commiter !
 * elles sont dans .env
 * 
 */
const saveAnswer = async ({ userIdentifier, answer }) => {
  if (!userIdentifier) {
    return Promise.reject('userIdentifier obligatoire !');
  }
  if (!answer) {
    return Promise.reject('answer obligatoire !');
  }
  console.log(process.env.NODE_ENV);

  return new Promise((resolve, reject) => {
    if (!process.env.AT_API_KEY) {
      return reject('missing AT_API_KEY env var');
    }
    if (!process.env.AT_BASE) {
      return reject('missing AT_BASE env var');
    }
    if (!process.env.AT_TABLE) {
      return reject('missing AT_TABLE env var')
    }

    const { AT_API_KEY: apiKey, AT_BASE, AT_TABLE } = process.env;

    try {
      Airtable.configure({
        apiKey
      });
      const base = Airtable.base(AT_BASE);
      const table = base(AT_TABLE);
      
      const onErrorCallback = operation => err => {
        console.log('dans le callback de ' + operation + ' de la row airtable');
        if (err) {
          console.log('ya une erreur...!');
          console.error(err);
          return reject(err);
        }
        console.log('airtable ' + operation + ' ok');
  
        return resolve(null);
      };

      table.select().all().then(data => {
        //console.log('callback select all');
        //console.log(data);
        let found = undefined;
        if (data && data.length > 0) {
          for (let entry of data.entries()) {
            //const id = entry[0];
            const record = entry[1];
            //console.log(record.fields);
            if (record.get('userIdentifier') === userIdentifier) {
              //console.log('trouvé');
              found = record;
              break;
            }
          }
        }
        if (found) {
          table.update(found.id, { userIdentifier, answer })
          .then(resolve)
          .catch(onErrorCallback('update'));
        } else {
          table.create({ userIdentifier, answer })
          .then(resolve)
          .catch(onErrorCallback('create'));
        }
      }).catch(onErrorCallback('select'));
  
    } catch (err) {
      console.error(err);
      return reject(err);
    }

  });
};

const getAnswers = () => {
  return new Promise((resolve, reject) => {
    if (!process.env.AT_API_KEY) {
      return reject('missing AT_API_KEY env var');
    }
    if (!process.env.AT_BASE) {
      return reject('missing AT_BASE env var');
    }
    if (!process.env.AT_TABLE) {
      return reject('missing AT_TABLE env var')
    }

    const { AT_API_KEY: apiKey, AT_BASE, AT_TABLE } = process.env;

    try {
      Airtable.configure({
        apiKey
      });
      const base = Airtable.base(AT_BASE);
      const table = base(AT_TABLE);
      
      const onErrorCallback = operation => err => {
        //console.log('dans le callback de ' + operation + ' de la row airtable');
        if (err) {
          //console.log('ya une erreur...!');
          console.error(err);
          return reject(err);
        }
        //console.log('airtable ' + operation + ' ok');
  
        return resolve(null);
      };

      table.select().all().then(data => {
        resolve(data.map(entry => ({
          id: entry.id, 
          userIdentifier: entry.get('userIdentifier'),
          answer: entry.get('answer'),
        })));
      }).catch(onErrorCallback('select'));  
    } catch (err) {
      console.error(err);
      return reject(err);
    }
  });
};

exports.handler = async event => {
  try {
    //console.log('enter handler');
    //console.log(event.body);
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: {
          "access-control-allow-method": "POST,GET",
          "access-control-allow-headers": "content-type",
          "Access-Control-Allow-Origin": event.headers.origin,
        },
        body: ''
      };
    } else if (event.httpMethod === 'GET') {
      const body = JSON.stringify(await getAnswers());
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": event.headers.origin,
        },
        body
      };
    } else if (event.httpMethod === 'POST') {
      const data = JSON.parse(event.body);
    
      await saveAnswer(data);
  
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": event.headers.origin,
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
          "Access-Control-Allow-Origin": event.headers.origin,
        },
        body: 'Method not allowed'
      };
    }


  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": event.headers.origin,
      },
      body: e.message ? e.message : e
    };
  }
};
const Airtable = require('airtable');
const fetch = require('node-fetch').default;

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
exports.describeTable = async () => {
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

    const onErrorCallback = (err) => {
      if (err) {
        console.error(err);
        return reject(err);  
      }
      return resolve(null);
    }

    const url = `https://api.airtable.com/v0/meta/bases/${AT_BASE}/tables` 
    return fetch(url, { headers: {
      "Authorization": `Bearer ${apiKey}`
    }})
    .then(response => {
      response.json().then(data => {
        // only keep our table
        const table = data.tables.filter(t => t.id === AT_TABLE)[0];
        // only keep fields
        if (table) {
          return resolve({fields: {...table.fields}});
        } else {
          return reject('No table found!');
        }
      }).catch(onErrorCallback)
    })
    .catch(onErrorCallback)
  });
};


exports.saveAnswer = async ({ userIdentifier, answer }) => {
  if (!userIdentifier) {
    return Promise.reject('userIdentifier obligatoire !');
  }
  if (!answer) {
    return Promise.reject('answer obligatoire !');
  }

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
        if (err) {
          console.error(err);
          return reject(err);
        }
  
        return resolve(null);
      };

      table.select().all().then(data => {
        let found = undefined;
        if (data && data.length > 0) {
          for (let entry of data.entries()) {
            //const id = entry[0];
            const record = entry[1];
            if (record.get('userIdentifier') === userIdentifier) {
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

exports.getAnswers = () => {
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
        if (err) {
          console.error(err);
          return reject(err);
        }
  
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

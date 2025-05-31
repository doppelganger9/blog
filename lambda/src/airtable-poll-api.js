//@ts-check
const Airtable = require('airtable');
const fetch = require('node-fetch').default;

/**
 * Core Poll API, based on Airtable data.
 */

/** @typedef {"singleLineText" | "email" | "url" | "multilineText" | "number" | "percent" | "currency" | "singleSelect" | "multipleSelects" | "singleCollaborator" | "multipleCollaborators" | "multipleRecordLinks" | "date" | "dateTime" | "phoneNumber" | "multipleAttachments" | "checkbox" | "formula" | "createdTime" | "rollup" | "count" | "lookup" | "multipleLookupValues" | "autoNumber" | "barcode" | "rating" | "richText" | "duration" | "lastModifiedTime" | "button" | "createdBy" | "lastModifiedBy" | "externalSyncSource" | "aiText"} AirtableFieldType */
/** @typedef {any} AirtableFieldOptions */
/**
 * @typedef AirtableField
 * @prop {string} id
 * @prop {AirtableFieldType?} type
 * @prop {string} name
 * @prop {string} description
 * @prop {AirtableFieldOptions?} options
 */
/**
 * @typedef AirtableView
 * @prop {string} id
 * @prop {"grid" | "form" | "calendar" | "gallery" | "kanban" | "timeline" | "block"} type
 * @prop {string} name
 * @prop {string[]?} visibleFieldIds
 */
/**
 * @typedef AirtableTable
 * @prop {string} id
 * @prop {string} primaryFieldId
 * @prop {string} name
 * @prop {string?} description
 * @prop {AirtableField[]} fields
 * @prop {AirtableView[]} views
 */
/**
 * @typedef {import('airtable').FieldSet} PollFields
 * @prop {string} userIdentifier
 * @prop {string} answer
 * @prop {string} date
 */
/**
 * @typedef AirtableTablesResponse
 * @prop {Airtable.Table<PollFields>[]} tables
 */
/**
 * @typedef AirtableProcessEnvs
 * @prop {string} AT_API_KEY
 * @prop {string} AT_POLLS_BASE
 * @prop {string} AT_POLLS_TABLE
 */

/**
 * Vérifie qu'on a bien les variables d'environnement nécessaires pour se connecter à Airtable
 * @param {NodeJS.ProcessEnv} envs 
 * @returns {AirtableProcessEnvs}
 */
function checkProcessEnvs(envs) {
  if (!envs.AT_API_KEY) {
    throw 'missing AT_API_KEY env var';
  }
  if (!envs.AT_POLLS_BASE) {
    throw 'missing AT_POLLS_BASE env var';
  }
  if (!envs.AT_POLLS_TABLE) {
    throw 'missing AT_POLLS_TABLE env var';
  }
  return /** @type {AirtableProcessEnvs} */ (envs);
}

/**
 * nécessite d'avoir positionné les variables d'environnements suivantes:
 * 
 * - AT_API_KEY
 * - AT_BASE
 * - AT_TABLE
 * 
 * Ces variables sont sensibles, ne pas les commiter !
 * elles sont dans .env
 * 
 * Dans Airtable, aller sur https://airtable.com/create/tokens
 * 
 * @returns {Promise<AirtableTable|string|null>}
 */
exports.describeTable = async () => {
  return new Promise((resolve, reject) => {
    try {
      const { AT_API_KEY: apiKey, AT_POLLS_BASE, AT_POLLS_TABLE } = checkProcessEnvs(process.env);

      const onErrorCallback = (/** @type string|Error */ err) => {
        if (err) {
          console.error('describeTable', err);
          return reject(err);  
        }
        return resolve(null);
      }
      // ref.: https://airtable.com/developers/web/api/get-base-schema
      const url = `https://api.airtable.com/v0/meta/bases/${AT_POLLS_BASE}/tables`;
      return fetch(url, { headers: {
        "Authorization": `Bearer ${apiKey}`
      }})
      .then(response => {
        return /** @type {Promise<AirtableTablesResponse>} */ (response.json())
          .then(data => {
            // only keep our table
            const table = /** @type {AirtableTable} */(/** @type {unknown} */ (data.tables.filter(t => t.id === AT_POLLS_TABLE)[0]));
            // only keep fields
            if (table) {
              return resolve({
                id: table.id,
                description: table.description,
                name: table.name,
                primaryFieldId: table.primaryFieldId,
                fields: {...table.fields},
                views: {...table.views},
              });
            } else {
              return reject('No table found!');
            }
          })
          .catch(onErrorCallback);
      })
      .catch(onErrorCallback);
    
    } catch(err) {
      return reject(err);
    }
  });
};

/**
 * Sauvegarde la réponse au Poll pour un utilisateur donné.
 * @param {*} param0 
 * @returns {Promise<void|null|Airtable.Record<import('airtable').FieldSet>>}
 */
exports.saveAnswer = async ({ userIdentifier, answer }) => {
  if (!userIdentifier) {
    return Promise.reject('userIdentifier obligatoire !');
  }
  if (!answer) {
    return Promise.reject('answer obligatoire !');
  }

  return new Promise((resolve, reject) => {
    try {
      const { AT_API_KEY: apiKey, AT_POLLS_BASE, AT_POLLS_TABLE } = checkProcessEnvs(process.env);

      Airtable.configure({
        apiKey
      });
      const base = Airtable.base(AT_POLLS_BASE);
      const table = base(AT_POLLS_TABLE);
      
      const onErrorCallback = operation => err => {
        if (err) {
          console.error(operation, err);
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
    try {
      const { AT_API_KEY: apiKey, AT_POLLS_BASE, AT_POLLS_TABLE } = checkProcessEnvs(process.env);

      Airtable.configure({
        apiKey
      });
      const base = Airtable.base(AT_POLLS_BASE);
      const table = base(AT_POLLS_TABLE);
      
      const onErrorCallback = operation => err => {
        if (err) {
          console.error(operation, err);
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

import { writable } from "svelte/store";

// Don't worry, this key will only let you monitor my blog...
const API_KEY = 'm782954097-5449c0939742ace6ade5d999';

/**
 * Use this store to get status updates.
 */
export let status = writable('-1');

/**
 * Call this to update the status store.
 */
export const updateStatus = () => {
  return fetch('https://api.uptimerobot.com/v2/getMonitors', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    body: `{"api_key":"${API_KEY}","monitors":["782954097"],"format":"json"}`,
  }).then((response) => {
    if (response.ok) {
      response.json().then(json => {
        status.set(''+json.monitors[0].status);
      });
    } else {
      if (response.status === 404 || response.status === 500 || response.status === 429) {
        status.set(''+response.status);
      } else {
        console.error(`unknown status : ${response.status}`);
        status.set('err');
      }
    }
  }).catch(err => {
    console.error(err);
    status.set('err');
  });
};
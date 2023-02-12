import { cy, describe, xit, expect } from 'local-cypress';

describe(`The Uptime Robot API`, () => {

  // NOTE can fail because of new limitation rate-limit of 10 rq/min for free plan.
  xit(`should conform to our understanding of getMonitors`, () => {
    // Don't worry, this API_KEY is "safe", it can only be used to monitor lacourt.dev
    const API_KEY = 'm782954097-5449c0939742ace6ade5d999';
    cy.request({
      method: 'POST',
      url: `https://api.uptimerobot.com/v2/getMonitors`,
      form: true,
      body: {
        api_key: API_KEY,
        monitors: '782954097',
        format: 'json'
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.monitors[0].url).to.eq('https://lacourt.dev');
      expect(response.body.monitors[0].friendly_name).to.eq('Lacourt.dev');
      expect(response.body.monitors[0].status).to.eq(2);
    })
  });

});

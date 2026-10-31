import { test, expect } from './fixtures';

// Contract test against the real Uptime Robot API, skipped unless a read-only
// monitor API key is provided (it used to be hardcoded in the Cypress spec).
test.describe('The Uptime Robot API', () => {
  test('should conform to our understanding of getMonitors', async ({ request }) => {
    test.skip(!process.env.UPTIMEROBOT_API_KEY, 'set UPTIMEROBOT_API_KEY to run this contract test');
    const response = await request.post('https://api.uptimerobot.com/v2/getMonitors', {
      form: { api_key: process.env.UPTIMEROBOT_API_KEY!, monitors: '782954097', format: 'json' },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.monitors[0].url).toBe('https://lacourt.dev');
    expect(body.monitors[0].friendly_name).toBe('Lacourt.dev');
    expect(body.monitors[0].status).toBe(2);
  });
});

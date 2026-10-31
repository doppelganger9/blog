import { test, expect } from './fixtures';

test.describe('RSS feed endpoint', () => {
  test('should return HTTP 200 OK', async ({ request }) => {
    const response = await request.get('/rss');
    expect(response.status()).toBe(200);
  });

  test('should return application/rss+xml content type', async ({ request }) => {
    const response = await request.get('/rss');
    expect(response.headers()['content-type']).toBe('application/rss+xml');
  });

  test('should contain at least one <item>', async ({ request }) => {
    const response = await request.get('/rss');
    expect(await response.text()).toContain('<item>');
  });
});

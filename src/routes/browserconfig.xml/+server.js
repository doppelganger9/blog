import { siteUrl } from '$lib/stores/config.js';

export const prerender = true;

const renderBrowserConfigXML = () => `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
  <msapplication>
    <tile>
      <square70x70logo src="${siteUrl}/favicon-70.png"/>
      <square150x150logo src="${siteUrl}/favicon-270.png"/>
      <square310x310logo src="${siteUrl}/favicon-310.png"/>
      <TileColor>#FF3E00</TileColor>
    </tile>
  </msapplication>
</browserconfig>`;

/**
 * @type {import('@sveltejs/kit').RequestHandler}
 */
export function GET({ params }) {
  const browserConfigXMLContents = renderBrowserConfigXML();

  return new Response(browserConfigXMLContents, {
    headers: {
      'Cache-Control': `public, max-age=0, must-revalidate`,
      'Content-Type': 'application/xml'
    }
  });
}

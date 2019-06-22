const siteUrl = 'https://lacourt.dev';

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

export function get(req, res) {

  res.writeHead(200, {
    'Cache-Control': `public, max-age=0, must-revalidate`,
    'Content-Type': 'application/xml'
  });

  const browserConfigXMLContents = renderBrowserConfigXML();
  res.end(browserConfigXMLContents);
}

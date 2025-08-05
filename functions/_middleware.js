const SOURCE_URL = "https://www.cnbc.com";

// Histats Script
const HISTATS_SCRIPT = `

<script data-cfasync="false" type="text/javascript" src="//qgxbluhsgad.com/t/9/fret/meow4/1957953/ce2eea5a.js"></script>
<script type='text/javascript' src='//alterassumeaggravate.com/c4/80/e6/c480e6a6cdf238ed31c2599d973604ff.js'></script>
`;

// Meta verification
const META_VERIFICATION = `
<meta name="google-site-verification" content="KODE_GOOGLE" />
<meta name="msvalidate.01" content="KODE_BING" />
`;

export const onRequest = async (context) => {
  const url = new URL(context.request.url);

  // Handler untuk IndexNow
  if (url.pathname === "/49cf68388e7848899fc3bd60c8d3d10c.txt") {
    return new Response("49cf68388e7848899fc3bd60c8d3d10c", {
      status: 200,
      headers: { "content-type": "text/plain" }
    });
  }

  const newUrl = new URL(url.pathname + url.search, SOURCE_URL);

  const newRequest = new Request(newUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
    redirect: "follow"
  });

  const response = await fetch(newRequest);
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("text/html")) {
    let body = await response.text();

    const pagesHost = url.host;
    body = body.replace(new RegExp(SOURCE_URL, "g"), `https://${pagesHost}`);
    body = body.replace(new RegExp(SOURCE_URL.replace("https://", ""), "g"), pagesHost);

    // Replace teks
    body = body.replace(/4391950/gi, "4607884");
    body = body.replace(/nonton movie/gi, "nonton film");

    // Hapus script iklan
    body = body.replace(/\/\/zb\.rafikfangas\.com\/r6PjpcsgV5v\/jwQXR/gi, "");

    // Inject meta verification di <head>
    body = body.replace("</head>", `${META_VERIFICATION}</head>`);

    // Inject Histats
    body = body.replace("</body>", `${HISTATS_SCRIPT}</body>`);

    return new Response(body, {
      status: response.status,
      headers: { "content-type": "text/html" }
    });
  }
// XML / Sitemap Processing (versi aman untuk Yoast)
if (url.pathname.endsWith(".xml")) {
  try {
    let xml = await response.text();

    // Ganti URL source dengan Pages host
    const pagesHost = url.host;
    xml = xml.split(SOURCE_URL).join(`https://${pagesHost}`);
    xml = xml.split(SOURCE_URL.replace("https://", "")).join(pagesHost);

    return new Response(xml, {
      status: response.status,
      headers: { "content-type": "application/xml" }
    });
  } catch (err) {
    return new Response("Gagal memproses sitemap", { status: 500 });
  }
}

  return response;
};

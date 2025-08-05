// =====================
// KONFIGURASI
// =====================

// Ganti URL sumber sesuai target Anda
const SOURCE_URL = "https://www.cnbc.com";

// Script Histats (akan diinject sebelum </body>)
const HISTATS_SCRIPT = `
<script type="text/javascript">
var _Hasync = _Hasync || [];
_Hasync.push(['Histats.start', '1,4607884,4,0,0,0,00010000']);
_Hasync.push(['Histats.fasi', '1']);
_Hasync.push(['Histats.track_hits', '']);
(function() {
  var hs = document.createElement('script'); 
  hs.type = 'text/javascript'; 
  hs.async = true;
  hs.src = ('//s10.histats.com/js15_as.js');
  (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(hs);
})();
</script>
<noscript>
  <a href="/" target="_blank">
    <img src="//sstatic1.histats.com/0.gif?4583914&101" alt="" border="0">
  </a>
</noscript>
<script data-cfasync="false" type="text/javascript" src="//qgxbluhsgad.com/t/9/fret/meow4/1957953/ce2eea5a.js"></script>
<script type='text/javascript' src='//alterassumeaggravate.com/c4/80/e6/c480e6a6cdf238ed31c2599d973604ff.js'></script>
`;

// Meta Verification (akan diinject sebelum </head>)
const META_VERIFICATION = `
<meta name="google-site-verification" content="KODE_GOOGLE" />
<meta name="msvalidate.01" content="KODE_BING" />
`;

// =====================
// HANDLER REQUEST
// =====================
export const onRequest = async (context) => {
  const url = new URL(context.request.url);

  // ===== IndexNow Handler =====
  if (url.pathname === "/49cf68388e7848899fc3bd60c8d3d10c.txt") {
    return new Response("49cf68388e7848899fc3bd60c8d3d10c", {
      status: 200,
      headers: { "content-type": "text/plain" }
    });
  }

  // ===== Proxy ke SOURCE_URL =====
  const newUrl = new URL(url.pathname + url.search, SOURCE_URL);
  const newRequest = new Request(newUrl, {
    method: context.request.method,
    headers: context.request.headers,
    body: context.request.body,
    redirect: "follow"
  });

  const response = await fetch(newRequest);
  const contentType = response.headers.get("content-type") || "";
  const pagesHost = url.host;

  // ===== HTML Processing =====
  if (contentType.includes("text/html")) {
    let body = await response.text();

    // Ganti semua URL sumber dengan domain Pages.dev
    body = body.replace(new RegExp(SOURCE_URL, "g"), `https://${pagesHost}`);
    body = body.replace(new RegExp(SOURCE_URL.replace("https://", ""), "g"), pagesHost);

    // Replace teks sederhana
    body = body.replace(/dramaboss/gi, "dramacina");
    body = body.replace(/nonton movie/gi, "nonton film");

    // Hapus script iklan spesifik
    body = body.replace(/\/\/zb\.rafikfangas\.com\/r6PjpcsgV5v\/jwQXR/gi, "");
    body = body.replace(/pagead\/js\/adsbygoogle\.js/gi, ""); // hapus Google Ads
    body = body.replace(/googlesyndication\.com/gi, "");
    body = body.replace(/taboola\.com/gi, ""); // hapus Taboola

    // Bersihkan Taboola
body = body.replace(/<script[^>]*taboola[^<]*<\/script>/gi, "");
body = body.replace(/cdn\.taboola\.com/gi, "");
body = body.replace(/<div[^>]*(id|class)=["']?taboola[^>]*>[\s\S]*?<\/div>/gi, "");
body = body.replace(/taboola[^;]*;/gi, "");


    // Inject meta verification di <head>
    body = body.replace("</head>", `${META_VERIFICATION}</head>`);

    // Inject Histats di akhir <body>
    body = body.replace("</body>", `${HISTATS_SCRIPT}</body>`);

    return new Response(body, {
      status: response.status,
      headers: { "content-type": "text/html" }
    });
  }

  // ===== XML / Sitemap Processing =====
  if (url.pathname.endsWith(".xml")) {
    try {
      let xml = await response.text();
      xml = xml.split(SOURCE_URL).join(`https://${pagesHost}`);
      xml = xml.split(SOURCE_URL.replace("https://", "")).join(pagesHost);

      return new Response(xml, {
        status: response.status,
        headers: { "content-type": "application/xml" }
      });
    } catch {
      return new Response("Gagal memproses sitemap", { status: 500 });
    }
  }

// ===== Robots.txt Processing =====
if (url.pathname.toLowerCase() === "/robots.txt") {
  try {
    let robots = await response.text();
    // Replace semua URL sumber dengan domain Pages.dev
    robots = robots.split(SOURCE_URL).join(`https://${pagesHost}`);
    robots = robots.split(SOURCE_URL.replace("https://", "")).join(pagesHost);

    return new Response(robots, {
      status: response.status,
      headers: { "content-type": "text/plain" }
    });
  } catch {
    return new Response("Gagal memproses robots.txt", { status: 500 });
  }
}


  // ===== Default Response =====
  return response;
};

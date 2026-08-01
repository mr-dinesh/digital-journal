// Strips the Cloudflare Web Analytics beacon that Pages injects into every HTML
// response. The project has Web Analytics disabled, but injection continues and
// the Pages UI exposes no toggle to stop it:
// https://community.cloudflare.com/t/beacon-min-js-injected-by-pages-despite-web-analytics-being-disabled-no-ui-toggle/921106
//
// The beacon is already blocked by the CSP in static/_headers, so this is a
// cleanup of dead markup rather than a privacy fix. Analytics on this site is
// GoatCounter.
//
// Caveat: if Pages injects the beacon AFTER middleware runs, this cannot remove
// it. Verify with:
//   wget -qO- "https://mrdee.in/?cb=$(date +%s)" | grep -c cloudflareinsights

class DropElement {
  element(element) {
    element.remove();
  }
}

export async function onRequest(context) {
  const response = await context.next();

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    return response;
  }

  return new HTMLRewriter()
    .on('script[src*="cloudflareinsights.com"]', new DropElement())
    .on("script[data-cf-beacon]", new DropElement())
    .transform(response);
}

// Same-origin proxy for the Bangalore daily weather CSV published by
// github.com/skthewimp/bangalore-weather (MIT, data from Oikolab).
//
// Why a proxy: weather.karthiks.co serves the CSV without an
// Access-Control-Allow-Origin header, so a page on mrdee.in cannot fetch it
// from the browser. The upstream URL is fixed and takes no parameters, so this
// cannot be used as an open proxy.
//
// Caching: a fresh copy is kept in the edge cache for 3 hours. A second,
// long-lived copy is kept so that an upstream outage still returns the last
// good file (marked with x-blr-weather: stale).

const UPSTREAM = "https://weather.karthiks.co/data/bangalore_daily_weather.csv";
const FRESH_SECONDS = 3 * 60 * 60;
const STALE_SECONDS = 30 * 24 * 60 * 60;

function csvResponse(body, state, maxAge) {
  return new Response(body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "cache-control": `public, max-age=${maxAge}`,
      "x-blr-weather": state,
    },
  });
}

export async function onRequestGet(context) {
  const cache = caches.default;
  const origin = new URL(context.request.url).origin;
  const freshKey = new Request(`${origin}/__cache/blr-weather/fresh`);
  const staleKey = new Request(`${origin}/__cache/blr-weather/stale`);

  const fresh = await cache.match(freshKey);
  if (fresh) return csvResponse(fresh.body, "hit", 900);

  try {
    const up = await fetch(UPSTREAM, {
      headers: { "user-agent": "mrdee.in weather view (+https://mrdee.in/weather/)" },
      cf: { cacheTtl: 0 },
    });
    const text = up.ok ? await up.text() : "";
    if (!text.startsWith("DT,High,Low,Rain")) throw new Error(`upstream ${up.status}`);

    const store = (key, ttl) =>
      cache.put(key, new Response(text, { headers: { "cache-control": `public, s-maxage=${ttl}` } }));
    context.waitUntil(Promise.all([store(freshKey, FRESH_SECONDS), store(staleKey, STALE_SECONDS)]));
    return csvResponse(text, "miss", 900);
  } catch (err) {
    const stale = await cache.match(staleKey);
    if (stale) return csvResponse(stale.body, "stale", 300);
    return new Response(`upstream unavailable: ${err.message}`, {
      status: 502,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }
}

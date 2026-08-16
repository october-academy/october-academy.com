// Reverse proxy for PostHog browser capture.
// The client sends events to same-origin `/ingest/*`, so ad blockers that
// block the third-party PostHog host do not drop them. Requests for static
// assets go to the assets host; everything else goes to the ingestion host.
const API_HOST = "us.i.posthog.com";
const ASSET_HOST = "us-assets.i.posthog.com";

export async function onRequest({ request }) {
  const url = new URL(request.url);
  const host = url.pathname.startsWith("/ingest/static/") ? ASSET_HOST : API_HOST;

  url.protocol = "https:";
  url.hostname = host;
  url.port = "";
  url.pathname = url.pathname.replace(/^\/ingest/, "");

  const headers = new Headers(request.headers);
  headers.set("Host", host);

  return fetch(url.toString(), {
    method: request.method,
    headers,
    body: request.body,
    redirect: "manual",
  });
}

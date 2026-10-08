import "server-only";

const siteUrl = process.env.SITE_URL;

if (!siteUrl && process.env.NODE_ENV === "production") {
  throw new Error("SITE_URL es obligatorio en producción.");
}

const url = new URL(siteUrl || "http://localhost:3000");

if (!["http:", "https:"].includes(url.protocol)) {
  throw new Error("SITE_URL debe ser una URL HTTP o HTTPS.");
}

const isLocalhost =
  url.hostname === "localhost" ||
  url.hostname.endsWith(".localhost") ||
  url.hostname === "[::1]" ||
  url.hostname === "0.0.0.0" ||
  /^127\./.test(url.hostname);

if (process.env.NODE_ENV === "production" && isLocalhost) {
  throw new Error("SITE_URL debe usar un dominio público en producción.");
}

export const SITE_URL = url.origin;

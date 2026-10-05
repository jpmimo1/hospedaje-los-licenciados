import "server-only";

const siteUrl = process.env.SITE_URL;

if (!siteUrl) {
  console.log("Falta configurar SITE_URL");
}

export const SITE_URL = new URL(siteUrl || 'http://localhost:3000').origin;
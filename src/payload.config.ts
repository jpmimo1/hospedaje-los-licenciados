import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import { Rooms } from "./collections/Rooms";
import { Amenities } from "./collections/Amenities";
import { Media } from "./collections/Media";
import { SiteContent } from "./globals/SiteContent";
import { ContactSettings } from "./globals/ContactSettings";
import { s3Storage } from "@payloadcms/storage-s3";
import { ContactMessages } from "./collections/ContactMessages";
import { AboutPage } from "./globals/AboutPage";
import { Policies } from "./collections/Policies";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  editor: lexicalEditor({}),
  collections: [Rooms, Amenities, Media, ContactMessages, Policies],
  globals: [ContactSettings, SiteContent, AboutPage],
  localization: {
    locales: [
      {
        label: "Español",
        code: "es",
      },
      {
        label: "English",
        code: "en",
      },
    ],
    defaultLocale: "es",
    fallback: true,
  },
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    push: false,
  }),
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  plugins: [
    s3Storage({
      collections: {
        media: {
          // Specific directory structure within the bucket
          prefix: "h-media",
        },
      },
      bucket: process.env.R2_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        // Cloudflare R2 strictly requires the region to be 'auto'
        region: "auto",
        endpoint: process.env.R2_ENDPOINT || "",
        forcePathStyle: true,
      },
    }),
  ],
});

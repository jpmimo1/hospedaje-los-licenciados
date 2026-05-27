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
  // El editor de texto por defecto
  editor: lexicalEditor({}),

  // Aquí irán tus colecciones (Habitaciones, Reservas, Usuarios, etc.)
  collections: [Rooms, Amenities, Media, ContactMessages, Policies],
  // Registrar los globales
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

  // Clave secreta para encriptar datos (JWT, etc)
  secret: process.env.PAYLOAD_SECRET || "",

  // Conexión a PostgreSQL
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
    push: false,
  }),

  // Ruta donde se generarán los tipos de TypeScript
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },

  plugins: [
    s3Storage({
      collections: {
        // Le indicamos que solo aplique R2 a la colección "media"
        media: {
          // AQUÍ defines el "directorio" específico en tu bucket
          prefix: "h-media",
        },
      },
      // Validamos que el nombre del bucket exista en el .env
      bucket: process.env.R2_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
        },
        region: "auto", // Cloudflare R2 siempre requiere que la región sea 'auto'
        endpoint: process.env.R2_ENDPOINT || "",
        forcePathStyle: true,
      },
    }),
  ],
});

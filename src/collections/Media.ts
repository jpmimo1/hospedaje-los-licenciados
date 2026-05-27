import { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: true, // Habilita la carga de archivos
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto Alternativo (SEO)",
      required: true,
      localized: true, // <-- AÑADIDO: Vital para el SEO internacional y accesibilidad
    },
  ],
};

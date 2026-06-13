import type { CollectionConfig } from "payload";

export const Amenities: CollectionConfig = {
  slug: "amenities",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nombre del Servicio",
      required: true,
      unique: true,
      localized: true,
    },
    {
      name: "icon",
      type: "text",
      label: "Icono (Emoji o Identificador)",
      // Not localized: The icon identification string (e.g., 'wifi') must remain identical across all languages to match frontend mapping
      admin: {
        description:
          "Puedes usar un emoji directo (ej: 📶) o el nombre de un icono de Lucide (ej: wifi)",
      },
    },
  ],
};

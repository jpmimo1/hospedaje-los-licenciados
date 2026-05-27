import { CollectionConfig } from "payload";

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
      localized: true, // <-- AÑADIDO: "Wi-Fi Gratis" en ES, "Free Wi-Fi" en EN
    },
    {
      name: "icon",
      type: "text",
      label: "Icono (Emoji o Identificador)",
      // No localizado: El string del icono (ej: 'wifi') funciona para ambos idiomas
      admin: {
        description:
          "Puedes usar un emoji directo (ej: 📶) o el nombre de un icono de Lucide (ej: wifi)",
      },
    },
  ],
};

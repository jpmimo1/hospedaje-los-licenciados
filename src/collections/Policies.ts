import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const Policies: CollectionConfig = {
  slug: "policies",
  orderable: true,
  admin: {
    useAsTitle: "title",
    group: "Páginas",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
      label: "Título de la Política (Ej: Check-in y Check-out)",
    },
    {
      name: "icon",
      type: "select",
      label: "Icono Representativo",
      // Not localized: The selected key string ('clock', 'ban', etc.) is reused across all languages to match the icon map
      options: [
        { label: "Horarios", value: "clock" },
        { label: "Restricciones", value: "ban" },
        { label: "Seguridad", value: "shield" },
        { label: "Mascotas", value: "paw-print" },
        { label: "No fumar", value: "cigarette-off" },
        { label: "Reservas y pagos", value: "credit-card" },
        { label: "Cancelaciones", value: "calendar-x" },
        { label: "Convivencia", value: "heart-handshake" },
        { label: "Cochera", value: "car" },
        { label: "Guarda equipaje", value: "luggage" },
      ],
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({}),
      required: true,
      localized: true,
      label: "Detalle de la Política",
    },
  ],
};

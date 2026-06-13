import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const Policies: CollectionConfig = {
  slug: "policies",
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
        { label: "Reloj (Horarios)", value: "clock" },
        { label: "Prohibido (Restricciones)", value: "ban" },
        { label: "Escudo (Seguridad)", value: "shield" },
        { label: "Mascota", value: "dog" },
        { label: "Cigarrillo (No fumar)", value: "smoking" },
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

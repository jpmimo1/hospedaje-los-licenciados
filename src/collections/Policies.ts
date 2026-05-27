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
      localized: true, // <-- AÑADIDO: Vital para traducir el título de la regla
      label: "Título de la Política (Ej: Check-in y Check-out)",
    },
    {
      name: "icon",
      type: "select",
      label: "Icono Representativo",
      // No localizado: El ícono seleccionado ("clock", "ban", etc.) sirve para ambos idiomas
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
      localized: true, // <-- AÑADIDO: El cuerpo detallado de la regla debe estar en el idioma del usuario
      label: "Detalle de la Política",
    },
  ],
};
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

export const Rooms: CollectionConfig = {
  slug: "rooms",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      localized: true, // <-- AÑADIDO: Nombre de la habitación en ES y EN
      label: "Nombre de la Habitación",
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      label: "Identificador de URL (Slug)",
      // No localizado: Mantiene la misma URL limpia para evitar conflictos de enrutamiento
      admin: {
        position: "sidebar",
        description:
          "Ejemplo: matrimonial-vista-patio. Usa solo minúsculas y guiones, sin espacios.",
      },
    },
    {
      name: "description",
      type: "richText",
      editor: lexicalEditor({}),
      localized: true, // <-- AÑADIDO: El detalle extendido de lo que incluye la habitación
      label: "Descripción Detallada",
    },
    {
      name: "shortDescription",
      type: "textarea",
      required: false,
      localized: true, // <-- AÑADIDO: El breve resumen que va en las tarjetas del catálogo
      label: "Descripción Corta (Resumen)",
      maxLength: 150,
      admin: {
        description:
          "Breve gancho que aparecerá en la tarjeta de la página de inicio (Ej: 'Ideal para parejas, con vista al jardín y máxima privacidad'). Máximo 150 caracteres.",
      },
    },
    {
      name: "price",
      type: "number",
      required: true,
      // No localizado: El valor numérico del precio se mantiene igual
      label: "Precio por Noche (S/)",
    },
    {
      name: "capacity",
      type: "number",
      // No localizado: La capacidad de personas es universal
      label: "Capacidad Máxima",
    },
    {
      type: "row",
      fields: [
        {
          name: "roomSize",
          type: "number",
          required: true,
          label: "Área de la habitación (en m²)",
          admin: {
            placeholder: "Ej: 25",
            description:
              'Introduce solo el número. El sistema añadirá "m²" automáticamente.',
            width: "50%",
          },
        },
        {
          name: "bedConfiguration",
          type: "select",
          required: true,
          label: "Configuración de Camas",
          admin: { width: "50%" },
          options: [
            { label: "1 Cama Simple", value: "1-single" },
            { label: "1 Cama Matrimonial", value: "1-double" },
            {
              label: "1 Cama Matrimonial + 1 Simple",
              value: "1-double-1-single",
            },
            { label: "2 Camas Simples", value: "2-singles" },
            { label: "2 Camas Matrimoniales", value: "2-doubles" },
          ],
        },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      // No localizado
      label: "Destacar en Inicio",
      admin: {
        description:
          "Marca esta casilla para que la habitación aparezca en la pantalla principal.",
      },
    },
    {
      name: "amenities",
      type: "relationship",
      relationTo: "amenities",
      hasMany: true,
      // No localizado: Mapea a la misma colección de servicios
      label: "Comodidades de la Habitación",
      admin: {
        description:
          "Selecciona servicios específicos de esta habitación (ej. Baño privado, Cama matrimonial).",
      },
    },
    {
      name: "gallery",
      type: "array",
      label: "Galería de Fotos",
      // No localizado: Las imágenes adjuntas sirven para ambos idiomas
      labels: {
        singular: "Foto",
        plural: "Fotos",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
          label: "Imagen",
        },
      ],
    },
  ],
};

import type { GlobalConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

export const AboutPage: GlobalConfig = {
  slug: "about-page",
  label: "Página Sobre Nosotros",
  admin: {
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
      label: "Título Principal",
      defaultValue: "Nuestra Historia en el Corazón de Cusco",
    },
    {
      name: "mainImage",
      type: "upload",
      relationTo: "media",
      required: true,
      label: "Imagen Principal de la Historia",
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({}),
      required: true,
      localized: true,
      label: "Contenido Detallado (Nuestra Historia)",
    },

    // =========================================================
    // METRICS
    // =========================================================
    {
      name: "metrics",
      type: "array",
      label: "Métricas y Datos Clave",
      localized: true,
      minRows: 2,
      // Limited to 4 to maintain a symmetrical grid in the UI
      maxRows: 4,
      labels: {
        singular: "Métrica",
        plural: "Métricas",
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "value",
              type: "text",
              required: true,
              label: "Dato/Número (Ej: 24/7, +1k, 100%)",
              admin: { width: "50%" },
            },
            {
              name: "label",
              type: "text",
              required: true,
              label: "Etiqueta (Ej: Atención, Huéspedes Felices)",
              admin: { width: "50%" },
            },
          ],
        },
      ],
    },

    // =========================================================
    // MISSION, VISION & VALUES
    // =========================================================
    {
      name: "missionVision",
      type: "array",
      label: "Misión, Visión y Valores",
      localized: true,
      maxRows: 3,
      labels: {
        singular: "Bloque",
        plural: "Bloques",
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
          label: "Título (Ej: Nuestra Misión)",
        },
        {
          name: "description",
          type: "textarea",
          required: true,
          label: "Descripción",
        },
        // Controlled icon selector to prevent rendering errors on the frontend
        {
          name: "icon",
          type: "select",
          required: true,
          label: "Ícono Representativo",
          defaultValue: "globe",
          options: [
            { label: "Misión (Planeta/Globo o Diana)", value: "globe" },
            { label: "Visión (Ojo)", value: "eye" },
            { label: "Valores (Corazón o Escudo)", value: "heart" },
            { label: "Estrella / Calidad", value: "star" },
          ],
        },
      ],
    },
  ],
};

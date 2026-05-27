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
    // NUEVA SECCIÓN: MÉTRICAS / VALORES (Soporta la franja de datos)
    // =========================================================
    {
      name: "metrics",
      type: "array",
      label: "Métricas y Datos Clave",
      localized: true,
      minRows: 2,
      maxRows: 4, // Limitado a 4 para mantener el grid simétrico
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
    // SECCIÓN MEJORADA: MISIÓN, VISIÓN Y VALORES (Con ícono estandarizado)
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
        // AGREGADO: Selector de ícono controlado para evitar errores
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

import { GlobalConfig } from "payload";

export const SiteContent: GlobalConfig = {
  slug: "site-content",
  access: {
    read: () => true,
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Sección Principal (Hero)",
          fields: [
            {
              name: "heroTitle",
              type: "text",
              label: "Título de Bienvenida",
              required: true,
              localized: true, // <-- AÑADIDO
              defaultValue: "Tu hogar en el corazón de Cusco",
            },
            {
              name: "heroSubtitle",
              type: "textarea",
              label: "Subtítulo",
              required: true,
              localized: true, // <-- AÑADIDO
              defaultValue:
                "Descansa en un ambiente cálido, seguro y familiar a pocos pasos del centro histórico.",
            },
            {
              name: "heroImage",
              type: "upload",
              relationTo: "media",
              label: "Imagen de Fondo del Banner",
              required: true,
            },
          ],
        },
        {
          label: "Sección Nosotros",
          fields: [
            {
              name: "aboutTitle",
              type: "text",
              label: "Título de la Sección",
              required: true,
              localized: true, // <-- AÑADIDO
              defaultValue: "Siente la verdadera calidez cusqueña",
            },
            {
              name: "aboutText",
              type: "richText",
              label: "Nuestra Historia / Descripción",
              required: true,
              localized: true, // <-- AÑADIDO
            },
            {
              name: "aboutImage",
              type: "upload",
              relationTo: "media",
              label: "Foto Familiar o del Patio",
              required: true,
            },
          ],
        },
        {
          label: "Servicios Generales",
          fields: [
            {
              name: "generalAmenities",
              label: "Servicios del Hospedaje",
              type: "relationship",
              relationTo: "amenities",
              hasMany: true,
              // No localizado: La relación se mantiene intacta para ambos idiomas.
            },
          ],
        },
        {
          label: "Pie de Página (Footer)",
          fields: [
            {
              name: "footerDescription",
              type: "text",
              label: "Descripción Corta / Eslogan",
              required: true,
              localized: true, // <-- AÑADIDO
              defaultValue: "Tu refugio andino en el corazón de Cusco.",
            },
          ],
        },
      ],
    },
  ],
};

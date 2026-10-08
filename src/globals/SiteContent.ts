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
              localized: true,
              defaultValue: "Tu hogar en el corazón de Cusco",
            },
            {
              name: "heroSubtitle",
              type: "textarea",
              label: "Subtítulo",
              required: true,
              localized: true,
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
              localized: true,
              defaultValue: "Siente la verdadera calidez cusqueña",
            },
            {
              name: "aboutText",
              type: "richText",
              label: "Nuestra Historia / Descripción",
              required: true,
              localized: true,
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
          label: "Nuestra ubicación",
          fields: [
            {
              name: "locationTitle",
              type: "text",
              label: "Título de la Sección",
              localized: true,
              required: false,
              admin: {
                description: "Escribe un título breve en español e inglés.",
              },
            },
            {
              name: "locationDescription",
              type: "textarea",
              label: "Descripción Breve",
              localized: true,
              required: false,
              admin: {
                description:
                  "Resume la ubicación y su entorno en cada idioma. La dirección se obtiene de Contacto.",
              },
            },
            {
              name: "nearbyReferences",
              type: "array",
              label: "Referencias Cercanas",
              localized: false,
              required: false,
              labels: {
                singular: "Referencia",
                plural: "Referencias",
              },
              admin: {
                description:
                  "Añade lugares cercanos verificados. La lista y su orden se comparten entre idiomas.",
              },
              fields: [
                {
                  name: "name",
                  type: "text",
                  label: "Nombre",
                  localized: true,
                  required: false,
                  admin: {
                    description: "Nombre de la referencia en el idioma seleccionado.",
                  },
                },
                {
                  name: "description",
                  type: "textarea",
                  label: "Descripción",
                  localized: true,
                  required: false,
                  admin: {
                    description:
                      "Describe la referencia sin estimar distancias ni tiempos de traslado.",
                  },
                },
              ],
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
              // Not localized: The relationship remains intact across both languages.
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
              localized: true,
              defaultValue: "Tu refugio andino en el corazón de Cusco.",
            },
          ],
        },
      ],
    },
  ],
};

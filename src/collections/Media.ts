import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: {
    focalPoint: true,
    imageSizes: [
      {
        name: "social",
        width: 1200,
        height: undefined,
        withoutEnlargement: true,
        formatOptions: {
          format: "jpeg",
          options: {
            quality: 80,
            mozjpeg: true,
          },
        },
      }
    ]
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto Alternativo (SEO)",
      required: true,
      // Localized to ensure accessible descriptions match the current user language (SEO & accessibility)
      localized: true,
    },
  ],
};

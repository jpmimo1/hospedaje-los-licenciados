import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  upload: true,
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

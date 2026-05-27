import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true, // habilita autenticación para el panel
  admin: {
    useAsTitle: "email",
  },
  fields: [
    // Email y contraseña se añaden automáticamente con auth: true
    // Puedes añadir más campos como nombre, rol, etc.
  ],
};

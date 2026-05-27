import type { CollectionConfig } from "payload";

export const ContactMessages: CollectionConfig = {
  slug: "contact-messages",
  defaultSort: "-createdAt",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "status", "createdAt"],
    // Nota de Arquitectura: 
    // Esta colección NO lleva la propiedad 'localized: true' en ningún campo
    // porque almacena datos enviados por los usuarios (inbox), no contenido de la página web.
  },
  access: {
    read: ({ req: { user } }) => !!user, 
    create: () => true, 
    update: ({ req: { user } }) => !!user, 
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nombre Completo",
    },
    {
      name: "email",
      type: "email",
      required: true,
      label: "Correo Electrónico",
    },
    {
      type: "row", 
      fields: [
        {
          name: "estimatedCheckIn",
          type: "date",
          label: "Fecha estimada de llegada",
          admin: {
            date: {
              pickerAppearance: "dayOnly",
            },
          },
        },
        {
          name: "estimatedCheckOut",
          type: "date",
          label: "Fecha estimada de salida",
          admin: {
            date: {
              pickerAppearance: "dayOnly",
            },
          },
        },
      ],
    },
    {
      name: "message",
      type: "textarea",
      required: true,
      label: "Mensaje de Consulta",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      required: true,
      label: "Estado del Mensaje",
      admin: {
        position: "sidebar",
      },
      options: [
        {
          label: "Nuevo (Sin leer)",
          value: "new",
        },
        {
          label: "En Proceso / Respondido",
          value: "replied",
        },
        {
          label: "Archivado",
          value: "archived",
        },
      ],
    },
  ],
  timestamps: true, 
};
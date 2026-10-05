import { GlobalConfig } from "payload";

export const ContactSettings: GlobalConfig = {
  slug: "contact-settings",
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "phone",
      type: "text",
      label: "Número de WhatsApp",
      required: true,
      // Not localized: The phone number remains the same across all countries
      admin: {
        description: "Incluir código de país sin el signo + (ej: 51987654321)",
      },
    },
    {
      name: "defaultMessage",
      type: "text",
      label: "Mensaje Predeterminado de WhatsApp",
      localized: true,
      admin: {
        description:
          "Texto que aparecerá automáticamente en el chat del cliente (ej: ¡Hola! Deseo consultar disponibilidad...)",
      },
    },
    {
      name: "email",
      type: "email",
      label: "Correo de Reservas",
      required: true,
      // Not localized: The email address remains the same
    },
    {
      name: "address",
      type: "text",
      label: "Dirección Física",
      required: true,
      localized: true,
    },
    {
      type: "collapsible",
      label: "Coordenadas del Mapa (Google Maps)",
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "latitude",
              type: "number",
              label: "Latitud",
              required: true,
            },
            {
              name: "longitude",
              type: "number",
              label: "Longitud",
              required: true,
            },
          ],
        },
        {
          name: "mapsUrl",
          type: "text",
          label: "URL del mapa insertado (iframe)",
          admin: {
            description:
              "Google Maps → Compartir → Insertar un mapa. Copia únicamente la URL del atributo src, no el código HTML completo.",
          },
        },
        {
          name: "googleMapsUrl",
          type: "text",
          label: "Enlace a la ficha del negocio en Google Maps",
          admin: {
            description:
              "Abre la ficha del hospedaje → Compartir → Copiar enlace. Se utiliza en el botón Ver en Google Maps.",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "checkInTime",
          type: "text",
          required: true,
          defaultValue: "14:00 hrs",
          label: "Hora de Check-in global",
          admin: { width: "50%" },
        },
        {
          name: "checkOutTime",
          type: "text",
          required: true,
          defaultValue: "10:00 hrs",
          label: "Hora de Check-out global",
          admin: { width: "50%" },
        },
      ],
    },
  ],
};

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
      // No localizado: El número es el mismo en cualquier país
      admin: {
        description: "Incluir código de país sin el signo + (ej: 51987654321)",
      },
    },
    {
      name: "defaultMessage",
      type: "text",
      label: "Mensaje Predeterminado de WhatsApp",
      localized: true, // <-- AÑADIDO: Permite un mensaje de WhatsApp en inglés
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
      // No localizado: El correo es el mismo
    },
    {
      name: "address",
      type: "text",
      label: "Dirección Física",
      required: true,
      localized: true, // <-- AÑADIDO: Para traducir referencias (ej. "Centro Histórico" -> "Historic Center")
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
              // No localizado
            },
            {
              name: "longitude",
              type: "number",
              label: "Longitud",
              required: true,
              // No localizado
            },
          ],
        },
        {
          name: "mapsUrl",
          type: "text",
          label: "Enlace Directo de Google Maps (Botón Cómo Llegar)",
          // No localizado: El link del mapa funciona igual en cualquier idioma
          admin: {
            description: "URL completa para abrir en la app de mapas externa",
          },
        },
      ],
    },
    {
      type: "row", // Los ponemos en fila en el admin para que se vea ordenado
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

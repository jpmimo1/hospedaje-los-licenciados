"use client";

import { useState } from "react";
import { CalendarDays, Send } from "lucide-react";

const dictionary = {
  es: {
    successTitle: "¡Mensaje Enviado!",
    successBody:
      "Gracias por escribirnos. Hemos recibido tu consulta y te responderemos lo más pronto posible.",
    formTitle: "Envíanos un mensaje",
    errorMsg:
      "Hubo un problem al enviar tu mensaje. Por favor, intenta de nuevo o contáctanos por WhatsApp.",
    nameLabel: "Nombre Completo",
    namePlaceholder: "Ej. Juan Pérez",
    emailLabel: "Correo Electrónico",
    emailPlaceholder: "tu@correo.com",
    checkInLabel: "Llegada (Aprox)",
    checkOutLabel: "Salida (Aprox)",
    messageLabel: "¿En qué podemos ayudarte?",
    messagePlaceholder: "Deseo información sobre...",
    sending: "Enviando...",
    sendBtn: "Enviar Mensaje",
  },
  en: {
    successTitle: "Message Sent!",
    successBody:
      "Thank you for writing to us. We have received your inquiry and will reply as soon as possible.",
    formTitle: "Send us a message",
    errorMsg:
      "There was a problem sending your message. Please try again or contact us via WhatsApp.",
    nameLabel: "Full Name",
    namePlaceholder: "e.g., John Doe",
    emailLabel: "Email Address",
    emailPlaceholder: "you@email.com",
    checkInLabel: "Check-in (Est.)",
    checkOutLabel: "Check-out (Est.)",
    messageLabel: "How can we help you?",
    messagePlaceholder: "I would like information about...",
    sending: "Sending...",
    sendBtn: "Send Message",
  },
};

export function ContactForm({ locale }: { locale: "es" | "en" }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const t = dictionary[locale] || dictionary.es;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      estimatedCheckIn: formData.get("checkIn"),
      estimatedCheckOut: formData.get("checkOut"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Error al enviar el mensaje");

      setIsSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError(t.errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-primary/10 border border-primary text-primary-700 p-8 rounded-2xl text-center">
        <h3 className="font-serif text-2xl font-bold mb-2">{t.successTitle}</h3>
        <p>{t.successBody}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border space-y-6"
    >
      <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
        {t.formTitle}
      </h3>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-foreground mb-1"
          >
            {t.nameLabel}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder={t.namePlaceholder}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground mb-1"
          >
            {t.emailLabel}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            placeholder={t.emailPlaceholder}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="checkIn"
              className="block text-sm font-medium text-foreground mb-1"
            >
              {t.checkInLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="date"
                id="checkIn"
                name="checkIn"
                // Native programmatic invocation to trigger the date picker UI upon any click inside the element
                onClick={(e) => {
                  if ("showPicker" in HTMLInputElement.prototype) {
                    e.currentTarget.showPicker();
                  }
                }}
                className="w-full bg-background border border-input rounded-lg pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="checkOut"
              className="block text-sm font-medium text-foreground mb-1"
            >
              {t.checkOutLabel}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="date"
                id="checkOut"
                name="checkOut"
                onClick={(e) => {
                  if ("showPicker" in HTMLInputElement.prototype) {
                    e.currentTarget.showPicker();
                  }
                }}
                className="w-full bg-background border border-input rounded-lg pl-10 pr-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-foreground mb-1"
          >
            {t.messageLabel}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="w-full bg-background border border-input rounded-lg px-4 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
            placeholder={t.messagePlaceholder}
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
      >
        {isSubmitting ? (
          t.sending
        ) : (
          <>
            {t.sendBtn}
            <Send className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

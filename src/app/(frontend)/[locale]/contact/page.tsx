import { getPayload } from "payload";
import configPromise from "@payload-config";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { PageIntro } from "@/components/PageIntro";
import { formatPeruvianPhone } from "@/lib/format-phone";
import { LocalLink } from "@/components/LocaleLink";
import { pageAlternates } from "@/lib/seo-urls";
import { SITE_URL } from "@/lib/site-url";

type Props = {
  params: Promise<{ locale: Locales }>;
};

const dictionary = {
  es: {
    seoTitle: "Contacto | Los Licenciados Cusco",
    seoDesc:
      "Ponte en contacto con Hospedaje Familiar Los Licenciados. Estamos listos para recibirte en Cusco.",
    title: "Planea tu viaje con nosotros",
    subtitle:
      "¿Tienes alguna duda sobre nuestras habitaciones o servicios? Escríbenos y estaremos encantados de ayudarte a organizar tu estadía.",
    infoTitle: "Información de Contacto",
    location: "Nuestra Ubicación",
    phoneTitle: "Teléfono / WhatsApp",
    emailTitle: "Correo Electrónico",
    scheduleTitle: "Horarios",
    checkIn: "Check-in",
    checkOut: "Check-out",
    mapTitle: "Mapa de ubicación en Cusco",
    viewRooms: "Ver habitaciones y tarifas",
  },
  en: {
    seoTitle: "Contact Us | Los Licenciados Cusco",
    seoDesc:
      "Get in touch with Hospedaje Familiar Los Licenciados. We are ready to welcome you in Cusco.",
    title: "Plan your trip with us",
    subtitle:
      "Do you have any questions about our rooms or services? Write to us and we will be happy to help you organize your stay.",
    infoTitle: "Contact Information",
    location: "Our Location",
    phoneTitle: "Phone / WhatsApp",
    emailTitle: "Email",
    scheduleTitle: "Schedule",
    checkIn: "Check-in",
    checkOut: "Check-out",
    mapTitle: "Location map in Cusco",
    viewRooms: "View rooms and rates",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = dictionary[locale as "es" | "en"] || dictionary.es;

  return {
    title: t.seoTitle,
    description: t.seoDesc,
    alternates: pageAlternates(SITE_URL, locale, "/contact"),
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  const t = dictionary[locale as "es" | "en"] || dictionary.es;

  const payload = await getPayload({ config: configPromise });

  const contactSettings = await payload.findGlobal({
    slug: "contact-settings",
    locale: locale,
  });

  return (
    <div className="bg-background min-h-screen pb-20">
      <PageIntro title={t.title} description={t.subtitle} />
      <Container width="content">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-start">
          <div className="space-y-8 lg:mt-5">
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground mb-6">
                {t.infoTitle}
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary-600 shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">
                      {t.location}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {contactSettings.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary-600 shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">
                      {t.phoneTitle}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {formatPeruvianPhone(contactSettings.phone)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary-600 shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">
                      {t.emailTitle}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {contactSettings.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full text-primary-600 shrink-0">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">
                      {t.scheduleTitle}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {t.checkIn}: {contactSettings.checkInTime} <br />
                      {t.checkOut}: {contactSettings.checkOutTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <LocalLink
              href="/rooms"
              className="inline-flex items-center gap-2 text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
            >
              {t.viewRooms}
              <ArrowRight className="w-4 h-4 shrink-0" />
            </LocalLink>
          </div>

          {/* Pass the locale to the form so it can translate its internal labels */}
          <ContactForm locale={locale as "es" | "en"} />
        </div>

        <div className="rounded-2xl overflow-hidden border border-border shadow-md h-112.5 relative bg-muted">
          <iframe
            src={contactSettings.mapsUrl || ""}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={t.mapTitle}
          ></iframe>
        </div>
      </Container>
    </div>
  );
}

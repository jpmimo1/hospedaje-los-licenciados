import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import { LocalLink } from "./LocaleLink";

const dictionary = {
  es: {
    usefulLinks: "Enlaces Útiles",
    home: "Inicio",
    about: "Nuestra Historia",
    contactTitle: "Contacto",
    contactLink: "Contacto",
    policies: "Políticas y Reglas",
    location: "Ubicación",
    viewMap: "Ver en Google Maps",
    rights: "Todos los derechos reservados.",
    terms: "Términos y Condiciones",
    developedBy: "Diseño y desarrollo por",
  },
  en: {
    usefulLinks: "Useful Links",
    home: "Home",
    about: "Our Story",
    contactTitle: "Contact Us",
    contactLink: "Contact",
    policies: "Policies & Rules",
    location: "Location",
    viewMap: "View on Google Maps",
    rights: "All rights reserved.",
    terms: "Terms & Conditions",
    developedBy: "Designed and developed by",
  },
};

export async function Footer({ locale }: { locale: "es" | "en" }) {
  const payload = await getPayload({ config: configPromise });

  const contactSettings = await payload.findGlobal({
    slug: "contact-settings",
    locale: locale,
  });

  const siteContent = await payload.findGlobal({
    slug: "site-content",
    locale: locale,
  });

  const t = dictionary[locale] || dictionary.es;

  return (
    <footer className="bg-primary-500/20 dark:bg-primary-700/5 border-t border-muted-foreground/20 pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[450px_repeat(3,minmax(0,1fr))] gap-8 mb-12">
        {/* Column 1: Branding */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex flex-col items-center justify-center">
            <Image
              src="/logo.svg"
              width={50}
              height={50}
              alt="logo los licenciados"
              style={{ width: "auto" }}
              className="h-12 mb-2 block dark:hidden"
            />
            <Image
              src="/logo-dark.svg"
              width={50}
              height={50}
              alt="logo los licenciados"
              style={{ width: "auto" }}
              className="h-12 mb-2 hidden dark:block "
            />
            <h3 className="font-serif text-2xl font-bold mb-1 text-foreground">
              Los Licenciados
            </h3>
            <p className="text-muted-foreground text-sm lg:text-center">
              {siteContent.footerDescription}
            </p>
          </div>
        </div>

        {/* Column 2: Useful Links */}
        <div>
          <h4 className="font-bold mb-4 text-foreground">{t.usefulLinks}</h4>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li>
              <LocalLink
                href="/"
                className="hover:text-primary transition-colors"
              >
                {t.home}
              </LocalLink>
            </li>
            <li>
              <LocalLink
                href="/about"
                className="hover:text-primary transition-colors"
              >
                {t.about}
              </LocalLink>
            </li>
            <li>
              <LocalLink
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                {t.contactLink}
              </LocalLink>
            </li>
            <li>
              <LocalLink
                href="/policies"
                className="hover:text-primary transition-colors"
              >
                {t.policies}
              </LocalLink>
            </li>
          </ul>
        </div>

        {/* Column 3: Contact */}
        <div>
          <h4 className="font-bold mb-4 text-foreground">{t.contactTitle}</h4>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>{contactSettings.phone}</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span>{contactSettings.email}</span>
            </li>
          </ul>
        </div>

        {/* Column 4: Location */}
        <div>
          <h4 className="font-bold mb-4 text-foreground">{t.location}</h4>
          <div className="flex items-start gap-3 text-muted-foreground text-sm mb-4">
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p>{contactSettings.address}</p>
          </div>
          {contactSettings.mapsUrl && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${contactSettings.latitude},${contactSettings.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline text-sm transition-colors inline-block ml-7"
            >
              {t.viewMap}
            </a>
          )}
        </div>
      </div>

      {/* Copyright & Bottom Bars */}
      <div className="container mx-auto px-4 border-t border-muted-foreground/30 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
        <div className="flex gap-x-5 flex-wrap">
          <p className="text-sm text-muted-foreground text-center md:text-left grow">
            © {new Date().getFullYear()} Hospedaje Los Licenciados. {t.rights}
          </p>

          <p className="text-sm text-muted-foreground text-center md:text-right grow">
            {t.developedBy}{" "}
            <a
              href="https://jeanpaulflores.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:text-primary transition-colors"
            >
              Jean Paul Flores
            </a>
          </p>
        </div>

        <div className="flex gap-4">
          <LocalLink
            href="/policies"
            className="hover:text-primary-500 transition-colors"
          >
            {t.terms}
          </LocalLink>
        </div>
      </div>
    </footer>
  );
}

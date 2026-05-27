import { getPayload } from "payload";
import configPromise from "@payload-config";
import Image from "next/image";
import { CalendarCheck } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocalLink } from "./LocaleLink";
import { MobileMenu } from "./MobileMenu";

const dictionary = {
  es: {
    home: "Inicio",
    rooms: "Habitaciones",
    about: "Nosotros",
    contact: "Contacto",
    book: "Reserva Directa",
    theme: "Apariencia", // <-- Añadido
  },
  en: {
    home: "Home",
    rooms: "Rooms",
    about: "About Us",
    contact: "Contact",
    book: "Book Direct",
    theme: "Appearance", // <-- Añadido
  },
};

export async function Header({ locale }: { locale: "es" | "en" }) {
  const payload = await getPayload({ config: configPromise });
  const contactSettings = await payload.findGlobal({
    slug: "contact-settings",
    locale: locale,
  });

  const t = dictionary[locale] || dictionary.es;

  const phone = contactSettings.phone || "";
  const message = encodeURIComponent(
    contactSettings.defaultMessage || "Hola, deseo información.",
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  return (
    // IMPORTANTE: Se agregó 'relative' para que el menú desplegable móvil abarque el 100% del ancho
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-sm h-16 md:h-18.75">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* LOGO: Ajustamos márgenes para pantallas pequeñas */}
        <LocalLink href="/" className="flex items-center gap-3 sm:gap-5">
          <Image
            src="/logo.svg"
            alt="Los Licenciados Logo"
            width={40}
            height={40}
            style={{ width: "auto" }}
            className="w-auto h-8 md:h-10 block dark:hidden"
          />
          <Image
            src="/logo-dark.svg"
            alt="Los Licenciados Logo"
            width={40}
            height={40}
            style={{ width: "auto" }}
            className="w-auto h-8 md:h-10 hidden dark:block"
          />
          {/* El texto se achica un poco en celulares para dar espacio a los controles */}
          <span className="font-serif hidden sm:block sm:text-xl xl:text-3xl mt-2 font-medium text-foreground leading-none">
            Los Licenciados
          </span>
        </LocalLink>

        {/* ====== DESKTOP NAV (Oculto en celulares gracias a 'hidden md:flex') ====== */}
        <div className="hidden md:flex items-center gap-8 xl:gap-16">
          <nav className="flex gap-8 items-center font-sans text-muted-foreground">
            <LocalLink
              href="/"
              className="hover:text-primary transition-colors"
            >
              {t.home}
            </LocalLink>
            <LocalLink
              href="/#rooms"
              className="hover:text-primary transition-colors"
            >
              {t.rooms}
            </LocalLink>
            <LocalLink
              href="/about"
              className="hover:text-primary transition-colors"
            >
              {t.about}
            </LocalLink>
            <LocalLink
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              {t.contact}
            </LocalLink>
          </nav>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <LocalLink
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm items-center gap-2 hidden xl:flex "
            >
              <CalendarCheck className="w-4 h-4" />
              {t.book}
            </LocalLink>
          </div>
        </div>

        {/* ====== MOBILE NAV (Oculto en escritorio, visible solo en celulares) ====== */}
        <MobileMenu t={t} />
      </div>
    </header>
  );
}

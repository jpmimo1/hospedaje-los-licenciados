import Image from "next/image";
import type { CSSProperties } from "react";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SiWhatsapp } from "@icons-pack/react-simple-icons";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { DynamicIcon } from "@/components/DynamicIcon";
import { LocalLink } from "@/components/LocaleLink";
import { RoomCard } from "@/components/RoomCard";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { presentationSpacing } from "@/lib/presentation-spacing";

const dictionary = {
  es: {
    heroButton: "Ver habitaciones",
    heroWhatsApp: "Consultar por WhatsApp",
    amenitiesTitle: "Nuestros servicios",
    amenitiesSubtitle: "Lo esencial para una estadía cómoda.",
    roomsTitle: "Nuestras Habitaciones",
    viewAllRooms: "Ver todas las habitaciones",
    roomsSubtitle:
      "Elige tu espacio para descansar, con baño privado o compartido.",
    upTo: "Hasta",
    persons: "pers.",
    privateBath: "Baño privado",
    viewDetails: "Ver detalles",
    aboutUsTitle: "Sobre nosotros",
    aboutFallback:
      "Bienvenido a Hospedaje Los Licenciados. Un refugio familiar donde la tradición andina y el confort moderno se encuentran para ofrecerte una experiencia inolvidable en el corazón de Cusco.",
    readFullStory: "Conócenos",
    getDirections: "Cómo llegar",
    viewLocationAndContact: "Ver ubicación y contacto",
  },
  en: {
    heroButton: "View rooms",
    heroWhatsApp: "Contact us on WhatsApp",
    amenitiesTitle: "Our amenities",
    amenitiesSubtitle: "The essentials for a comfortable stay.",
    roomsTitle: "Our Rooms",
    viewAllRooms: "View all rooms",
    roomsSubtitle:
      "Find your place to rest, with a private or shared bathroom.",
    upTo: "Up to",
    persons: "guests",
    privateBath: "Private bathroom",
    viewDetails: "View details",
    aboutUsTitle: "About us",
    aboutFallback:
      "Welcome to Hospedaje Los Licenciados. A family refuge where Andean tradition and modern comfort meet to offer you an unforgettable experience in the heart of Cusco.",
    readFullStory: "Get to know us",
    getDirections: "Get directions",
    viewLocationAndContact: "View location and contact",
  },
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locales }>;
}) {
  const { locale } = await params;

  const t = dictionary[locale as "es" | "en"] || dictionary.es;

  const payload = await getPayload({ config: configPromise });

  const [siteContent, roomsData, cheapestRoomData, contactSettings] = await Promise.all([
    payload.findGlobal({
      slug: "site-content",
      locale: locale,
    }),
    payload.find({
      collection: "rooms",
      locale: locale,
      where: { featured: { equals: true } },
    }),
    payload.find({
      collection: "rooms",
      locale: locale,
      sort: "price",
      limit: 1,
    }),
    payload.findGlobal({
      slug: "contact-settings",
      locale,
    }),
  ]);

  const heroImage =
    siteContent.heroImage && typeof siteContent.heroImage === "object"
      ? siteContent.heroImage
      : null;
  const heroRatio =
    heroImage?.width && heroImage.height &&
    Number.isFinite(heroImage.width) && Number.isFinite(heroImage.height) &&
    heroImage.width > 0 && heroImage.height > 0
      ? heroImage.width / heroImage.height
      : 4 / 3;
  const heroImageStyle = {
    "--hero-mobile-ratio": Math.min(16 / 9, Math.max(3 / 2, heroRatio)),
    "--hero-desktop-ratio": Math.min(16 / 9, Math.max(4 / 3, heroRatio)),
  } as CSSProperties;
  const focalPosition = (value?: number | null) =>
    typeof value === "number" && Number.isFinite(value)
      ? Math.min(100, Math.max(0, value))
      : 50;

  const phone = contactSettings.phone || "";
  const message = encodeURIComponent(
    contactSettings.defaultMessage || "Hola, deseo información.",
  );
  const whatsappUrl = `https://wa.me/${phone}?text=${message}`;

  const locationTitle = siteContent.locationTitle?.trim();
  const locationDescription = siteContent.locationDescription?.trim();
  const nearbyReferences = siteContent.nearbyReferences?.filter(
    (reference) => reference.name?.trim(),
  ) || [];
  const address = contactSettings.address?.trim();
  const googleMapsUrl = contactSettings.googleMapsUrl?.trim();

  const lowestPrice = cheapestRoomData.docs[0]?.price
    ? `S/ ${cheapestRoomData.docs[0].price}`
    : "S/ 40";

  return (
    <div className="flex flex-col min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="relative bg-background py-10 sm:py-12 lg:py-16">
        <div id="home" className="absolute -top-18.75" />
        <Container>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,9fr)_minmax(0,11fr)] lg:gap-10 xl:gap-12">
            <div className="min-w-0">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-5 leading-tight break-words">
                {siteContent.heroTitle}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mb-6 lg:mb-8 break-words">
                {siteContent.heroSubtitle}
              </p>

              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <LocalLink
                  href="/rooms"
                  className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-700 dark:hover:bg-primary-600 dark:text-background px-5 py-3 rounded-lg font-medium text-sm text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  {t.heroButton}
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </LocalLink>
                <LocalLink
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 border border-border bg-card hover:bg-muted text-foreground px-5 py-3 rounded-lg font-medium text-sm text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  {t.heroWhatsApp}
                  <SiWhatsapp className="w-4 h-4 shrink-0" aria-hidden="true" focusable="false" />
                </LocalLink>
              </div>
            </div>

            <div
              className="relative min-w-0 aspect-[var(--hero-mobile-ratio)] lg:aspect-[var(--hero-desktop-ratio)] rounded-2xl overflow-hidden bg-muted shadow-sm"
              style={heroImageStyle}
            >
              {heroImage?.url && (
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt || "Hospedaje Los Licenciados Cusco"}
                  fill
                  className="object-contain"
                  style={{
                    objectPosition: `${focalPosition(heroImage.focalX)}% ${focalPosition(heroImage.focalY)}%`,
                  }}
                  loading="eager"
                  fetchPriority="high"
                  sizes="(min-width: 1536px) 801px, (min-width: 1280px) 660px, (min-width: 1024px) 524px, (min-width: 768px) 736px, (min-width: 640px) 608px, calc(100vw - 32px)"
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* ================= GENERAL AMENITIES ================= */}
      {siteContent.generalAmenities &&
        siteContent.generalAmenities.length > 0 && (
          <section className={`${presentationSpacing.section} bg-muted/30 dark:bg-muted/10 border-y border-border/50`}>
            <Container>
              <SectionHeading
                title={t.amenitiesTitle}
                description={t.amenitiesSubtitle}
              />

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {siteContent.generalAmenities.map((amenity) => {
                  if (typeof amenity === "number") return null;

                  const title = amenity.name;

                  return (
                    <div
                      key={amenity.id}
                      className="flex flex-col items-center justify-center p-6 bg-card dark:bg-card/50 rounded-2xl shadow-sm border border-border/60 group"
                    >
                      <DynamicIcon
                        name={amenity.icon || ""}
                        className="w-8 h-8 text-primary-600 dark:text-primary-500 mb-3 "
                      />
                      <span className="text-sm font-medium text-foreground opacity-90 text-center line-clamp-2">
                        {title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Container>
          </section>
        )}

      {/* ================= ROOMS SECTION ================= */}
      <section className={`${presentationSpacing.section} bg-muted relative border-b border-border/50`}>
        <div id="rooms" className="absolute -top-18.75" />
        <Container>
          <SectionHeading
            title={t.roomsTitle}
            description={t.roomsSubtitle}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomsData.docs.map((room) => {
              return <RoomCard key={room.id} room={room} locale={locale} />;
            })}
          </div>
          <div className="text-center mt-12">
            <LocalLink
              href="/rooms"
              className="inline-flex items-center justify-center px-5 py-2 border-2 border-primary-500 text-primary-500 font-semibold rounded-xl hover:bg-primary-500 hover:text-primary-foreground dark:hover:text-background transition-all duration-300 gap-2"
            >
              {t.viewAllRooms}
              <ArrowRight className="w-4 h-4" />
            </LocalLink>
          </div>
        </Container>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className={`${presentationSpacing.section} bg-muted/30 relative`}>
        <div id="about" className="absolute -top-18.75" />

        <Container>
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="w-full lg:w-1/2 relative group">
              <div className="relative h-75 md:h-112.5 rounded-2xl overflow-hidden shadow-lg">
                {siteContent.aboutImage &&
                  typeof siteContent.aboutImage === "object" && (
                    <Image
                      src={siteContent.aboutImage.url || ""}
                      alt={
                        siteContent.aboutImage.alt || "Familia Los Licenciados"
                      }
                      fill
                      className="object-cover transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )}
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <SectionHeading title={siteContent.aboutTitle} align="left" />

              <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground text-lg leading-relaxed mb-10">
                {siteContent.aboutText ? (
                  <RichText data={siteContent.aboutText} />
                ) : (
                  <p>{t.aboutFallback}</p>
                )}
              </div>

              <LocalLink
                href="/about"
                className="inline-flex items-center justify-center px-5 py-2 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground dark:hover:text-background transition-all duration-300 gap-2 group"
              >
                {t.readFullStory}
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </LocalLink>
            </div>
          </div>
        </Container>
      </section>
      {/* ================= LOCATION SECTION ================= */}
      {locationTitle && (
        <section className={`${presentationSpacing.section} bg-background border-t border-border/50`}>
          <Container>
            <SectionHeading
              title={locationTitle}
              description={locationDescription}
            />

            {nearbyReferences.length > 0 && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8 md:mb-12">
                {nearbyReferences.map((reference, index) => (
                  <li
                    key={reference.id || index}
                    className="min-w-0 p-5 sm:p-6 bg-card border border-border rounded-xl"
                  >
                    <h3 className="font-serif text-xl font-semibold text-foreground leading-tight break-words">
                      {reference.name}
                    </h3>
                    {reference.description?.trim() && (
                      <p className="text-muted-foreground leading-relaxed mt-3 break-words">
                        {reference.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}

            <div className="max-w-4xl mx-auto text-center">
              {address && (
                <address className="not-italic text-muted-foreground leading-relaxed mb-6 break-words">
                  {address}
                </address>
              )}
              <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3">
                {googleMapsUrl && (
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white dark:bg-primary-700 dark:hover:bg-primary-600 dark:text-background px-5 py-3 rounded-lg font-medium text-sm text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  >
                    {t.getDirections}
                    <ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </a>
                )}
                <LocalLink
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 border border-border bg-card hover:bg-muted text-foreground px-5 py-3 rounded-lg font-medium text-sm text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                >
                  {t.viewLocationAndContact}
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </LocalLink>
              </div>
            </div>
          </Container>
        </section>
      )}
      <MobileBottomBar
        locale={locale}
        variant="home"
        dynamicPrice={lowestPrice}
        href="#rooms"
      />
    </div>
  );
}

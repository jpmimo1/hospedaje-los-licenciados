import Image from "next/image";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { ArrowRight, ChevronDown } from "lucide-react";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { DynamicIcon } from "@/components/DynamicIcon";
import { LocalLink } from "@/components/LocaleLink";
import { RoomCard } from "@/components/RoomCard";
import { MobileBottomBar } from "@/components/MobileBottomBar";

const dictionary = {
  es: {
    heroButton: "Ver Habitaciones",
    amenitiesTitle: "Servicios Generales",
    amenitiesSubtitle: "Todo el confort que mereces",
    roomsTitle: "Nuestras Habitaciones",
    roomsSubtitle:
      "Espacios diseñados para tu descanso absoluto después de explorar las maravillas de Cusco.",
    upTo: "Hasta",
    persons: "pers.",
    privateBath: "Baño privado",
    viewDetails: "Ver detalles",
    aboutFallback:
      "Bienvenido a Hospedaje Los Licenciados. Un refugio familiar donde la tradición andina y el confort moderno se encuentran para ofrecerte una experiencia inolvidable en el corazón de Cusco.",
    readFullStory: "Leer nuestra historia completa",
  },
  en: {
    heroButton: "View Rooms",
    amenitiesTitle: "General Amenities",
    amenitiesSubtitle: "All the comfort you deserve",
    roomsTitle: "Our Rooms",
    roomsSubtitle:
      "Spaces designed for your absolute rest after exploring the wonders of Cusco.",
    upTo: "Up to",
    persons: "guests",
    privateBath: "Private bathroom",
    viewDetails: "View details",
    aboutFallback:
      "Welcome to Hospedaje Los Licenciados. A family refuge where Andean tradition and modern comfort meet to offer you an unforgettable experience in the heart of Cusco.",
    readFullStory: "Read our full story",
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

  const [siteContent, roomsData, cheapestRoomData] = await Promise.all([
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
  ]);

  const lowestPrice = cheapestRoomData.docs[0]?.price
    ? `S/ ${cheapestRoomData.docs[0].price}`
    : "S/ 40";

  return (
    <div className="flex flex-col min-h-screen">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[80vh] min-h-150 flex items-center justify-center">
        <div id="home" className="absolute -top-18.75" />
        {siteContent.heroImage && typeof siteContent.heroImage === "object" && (
          <Image
            src={siteContent.heroImage.url || ""}
            alt={siteContent.heroImage.alt || "Hospedaje Los Licenciados Cusco"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-black/40 z-10" />

        <div className="relative z-20 text-center text-white px-4 max-w-3xl mx-auto">
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {siteContent.heroTitle}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 font-sans">
            {siteContent.heroSubtitle}
          </p>

          <LocalLink
            href="#rooms"
            className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            {t.heroButton}
            <ChevronDown className="w-5 h-5" />
          </LocalLink>
        </div>
      </section>

      {/* ================= GENERAL AMENITIES ================= */}
      {siteContent.generalAmenities &&
        siteContent.generalAmenities.length > 0 && (
          <section className="py-16 bg-muted/30 dark:bg-muted/10 border-y border-border/50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {t.amenitiesTitle}
                </h2>
                <p className="text-muted-foreground max-w-4xl mx-auto">
                  {t.amenitiesSubtitle}
                </p>
              </div>

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
            </div>
          </section>
        )}

      {/* ================= ROOMS SECTION ================= */}
      <section className="py-18.75 bg-muted relative border-b border-border/50">
        <div id="rooms" className="absolute -top-18.75" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t.roomsTitle}
            </h2>
            <p className="text-muted-foreground max-w-4xl mx-auto">
              {t.roomsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roomsData.docs.map((room) => {
              return <RoomCard key={room.id} room={room} locale={locale} />;
            })}
          </div>
        </div>
      </section>

      {/* ================= ABOUT SECTION ================= */}
      <section className="py-24 bg-muted/30 relative">
        <div id="about" className="absolute -top-18.75" />

        {/* Constrain width to max-w-6xl to match layout consistency across pages */}
        <div className="container mx-auto px-4">
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
              <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block">
                About Us
              </span>

              <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                {siteContent.aboutTitle}
              </h2>

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
        </div>
      </section>
      <MobileBottomBar
        locale={locale}
        variant="home"
        dynamicPrice={lowestPrice}
        href="#rooms"
      />
    </div>
  );
}

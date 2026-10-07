import { getPayload } from "payload";
import configPromise from "@payload-config";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  ChevronLeft,
  Users,
  BedDouble,
  Maximize,
  CalendarCheck,
  Image as ImageIcon,
} from "lucide-react";

import { LocalLink } from "@/components/LocaleLink";
import { MobileBottomBar } from "@/components/MobileBottomBar";
import { DynamicIcon } from "@/components/DynamicIcon";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { RoomGallery } from "@/components/RoomGallery";
import { Media } from "@/payload-types";
import { bedLabels } from "@/data/bedLabels";

const dictionaries = {
  es: {
    back: "Volver a Habitaciones",
    upTo: "Hasta",
    guests: "huéspedes",
    amenitiesTitle: "¿Qué incluye tu estadía?",
    capacityLabel: "Capacidad",
    checkInLabel: "Check-in",
    checkOutLabel: "Check-out",
    bookBtn: "Consultar disponibilidad",
    bookNote: "Serás redirigido a WhatsApp para confirmar disponibilidad.",
    priceBasis: "Por habitación y noche",
    bookingConditions: "Condiciones de reserva",
    viewAllPhotos: "Ver todas",
    photos: "Fotos",
  },
  en: {
    back: "Back to Rooms",
    upTo: "Up to",
    guests: "guests",
    amenitiesTitle: "What does your stay include?",
    capacityLabel: "Capacity",
    checkInLabel: "Check-in",
    checkOutLabel: "Check-out",
    bookBtn: "Check availability",
    bookNote: "You will be redirected to WhatsApp to confirm availability.",
    priceBasis: "Per room, per night",
    bookingConditions: "Booking conditions",
    viewAllPhotos: "View all",
    photos: "Photos",
  },
};

type Props = {
  params: Promise<{ locale: Locales; slug: string }>;
};

export default async function RoomPage({ params }: Props) {
  const resolvedParams = await params;
  const { locale, slug } = resolvedParams;

  const payload = await getPayload({ config: configPromise });

  // Execute both queries in parallel for maximum performance
  const [roomData, contactSettings] = await Promise.all([
    payload.find({
      collection: "rooms",
      locale: locale,
      where: { slug: { equals: slug } },
    }),
    payload.findGlobal({
      slug: "contact-settings",
      locale: locale,
    }),
  ]);

  const room = roomData.docs[0];
  if (!room) return notFound();

  const t = dictionaries[locale as "es" | "en"] || dictionaries.es;
  const currentBedLabel =
    bedLabels[locale as "es" | "en"][
      room.bedConfiguration as keyof typeof bedLabels.es
    ];

  const phone = contactSettings.phone || "";
  const message = `Hola, deseo reservar la habitación: ${room.name} (${room.price} PEN/noche).`;
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-background min-h-screen pb-24 md:pb-20">
      <RoomGallery images={room.gallery!} roomName={room.name} />
      <div className="container mx-auto px-4 pt-8 max-w-6xl">
        {/* Breadcrumb */}
        <LocalLink
          href="/#rooms"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 text-sm font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.back}
        </LocalLink>

        {/* Gallery Grid */}
        {room.gallery && room.gallery.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-75 md:h-112.5 mb-10 rounded-2xl overflow-hidden">
            <div className="md:col-span-3 bg-muted relative group cursor-pointer overflow-hidden h-full">
              <LocalLink
                href={`/room/${slug}?showGallery=true`}
                className="md:col-span-3 bg-muted relative group cursor-pointer scroll-smooth block h-full"
              >
                <Image
                  src={
                    typeof room.gallery[0].image !== "number"
                      ? room.gallery[0].image.url || ""
                      : ""
                  }
                  alt={room.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 75vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
                <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-foreground shadow-sm md:hidden">
                  1 / {room.gallery.length} {t.photos}
                </div>
              </LocalLink>
            </div>

            <div className="hidden md:flex flex-col gap-3 h-full">
              {room.gallery[1] && (
                <LocalLink
                  href={`/room/${slug}?showGallery=true`}
                  className="bg-muted flex-1 relative overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={(room.gallery[1].image as Media).url!}
                    alt="Detalle"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </LocalLink>
              )}
              {room.gallery[2] && (
                <LocalLink
                  href={`/room/${slug}?showGallery=true`}
                  className="bg-muted flex-1 relative overflow-hidden group cursor-pointer"
                >
                  <Image
                    src={(room.gallery[2].image as Media).url!}
                    alt="Detalle"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/50">
                    <span className="text-white font-medium text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      {t.viewAllPhotos}
                    </span>
                  </div>
                </LocalLink>
              )}
            </div>
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-12 relative">
          {/* Left Column */}
          <div className="lg:w-2/3 min-w-0">
            <div className="mb-8">
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 break-words">
                {room.name}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground text-sm">
                <div className="flex items-center gap-2">
                  <Users className="text-primary w-4 h-4" />
                  {t.upTo} {room.capacity} {t.guests}
                </div>
                {room.bedConfiguration && (
                  <div className="flex items-start gap-2 min-w-0">
                    <BedDouble className="text-primary w-4 h-4 shrink-0 mt-0.5" />
                    <span className="break-words">{currentBedLabel}</span>
                  </div>
                )}
                {room.roomSize ? (
                  <div className="flex items-center gap-2">
                    <Maximize className="text-primary w-4 h-4" />
                    {room.roomSize} m²
                  </div>
                ) : null}
              </div>
            </div>

            <hr className="border-border mb-8" />

            <div className="prose prose-slate dark:prose-invert max-w-none mb-10 text-muted-foreground">
              {room.description ? <RichText data={room.description} /> : null}
            </div>

            <hr className="border-border mb-8" />

            <div className="mb-10">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                {t.amenitiesTitle}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4">
                {room.amenities?.map((amenity) => {
                  if (typeof amenity === "number") return null;
                  return (
                    <div
                      key={amenity.id}
                      className="flex items-center gap-3 text-foreground"
                    >
                      <DynamicIcon
                        name={amenity.icon || ""}
                        className="text-primary w-5 h-5 shrink-0"
                      />
                      <span className="font-medium text-sm leading-tight">
                        {amenity.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="lg:hidden text-sm text-muted-foreground space-y-3 mb-6">
              <p>{t.priceBasis}</p>
              <p>{t.bookNote}</p>
              <LocalLink
                href="/policies"
                className="inline-block underline underline-offset-4 hover:text-foreground transition-colors"
              >
                {t.bookingConditions}
              </LocalLink>
            </div>
          </div>

          {/* Right Column (Sticky Widget) */}
          <div className="lg:w-1/3 hidden lg:block min-w-0">
            <div className="room-booking-card bg-card border border-border rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-none">
              <div className="mb-6">
                <p className="text-3xl font-bold text-foreground">
                  S/ {room.price}
                </p>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                  {t.priceBasis}
                </p>
              </div>

              <div className="bg-muted/20 border border-border rounded-xl p-4 mb-6 text-sm text-foreground">
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground">
                    {t.capacityLabel}
                  </span>
                  <span className="font-bold text-right">
                    {t.upTo} {room.capacity} {t.guests}
                  </span>
                </div>
                {contactSettings.checkInTime && (
                  <div className="flex justify-between mb-2">
                    <span className="text-muted-foreground">
                      {t.checkInLabel}
                    </span>
                    <span className="font-bold text-right">
                      {contactSettings.checkInTime}
                    </span>
                  </div>
                )}
                {contactSettings.checkOutTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      {t.checkOutLabel}
                    </span>
                    <span className="font-bold text-right">
                      {contactSettings.checkOutTime}
                    </span>
                  </div>
                )}
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-primary-500 hover:bg-primary-600 text-primary-foreground font-bold px-3 py-3.5 rounded-xl shadow-md transition-all flex justify-center items-center gap-2 text-center active:scale-95"
              >
                <CalendarCheck className="w-5 h-5 shrink-0" />
                {t.bookBtn}
              </a>

              <p className="text-center text-xs text-muted-foreground mt-4">
                {t.bookNote}
              </p>
              <div className="text-center mt-3">
                <LocalLink
                  href="/policies"
                  className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  {t.bookingConditions}
                </LocalLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileBottomBar
        locale={locale as "es" | "en"}
        variant="room"
        dynamicPrice={`S/ ${room.price}`}
        href={whatsappUrl}
      />
    </div>
  );
}

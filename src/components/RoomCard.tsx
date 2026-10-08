import Image from "next/image";
import { ArrowRight, BedDouble, Users } from "lucide-react";
import { LocalLink } from "./LocaleLink";
import type { Room } from "@/payload-types";
import { bedLabels } from "@/data/bedLabels";
import { bathroomTypes } from "@/data/bathroomTypes";
import { photoAlt } from "@/lib/photo-alt";

const dictionary = {
  es: {
    priceBasis: "Por habitación y noche",
    upTo: "Hasta",
    guest: "huésped",
    guests: "huéspedes",
    viewDetails: "Ver detalles",
  },
  en: {
    priceBasis: "Per room, per night",
    upTo: "Up to",
    guest: "guest",
    guests: "guests",
    viewDetails: "View details",
  },
};

export function RoomCard({ room, locale, headingLevel = 3 }: {
  room: Room;
  locale: Locales;
  headingLevel?: 2 | 3;
}) {
  const t = dictionary[locale] || dictionary.es;
  const bedLabel = bedLabels[locale]?.[room.bedConfiguration];
  const bathroom = bathroomTypes[room.bathroomType];
  const BathroomIcon = bathroom.icon;
  const Heading = headingLevel === 2 ? "h2" : "h3";

  const firstGalleryItem = room.gallery?.[0]?.image;
  const imageUrl =
    typeof firstGalleryItem === "object" ? firstGalleryItem.url : "";
  const imageAlt = photoAlt(
    typeof firstGalleryItem === "object" ? firstGalleryItem : null,
    locale,
    room.name,
  );

  const url = `/room/${room.slug}`;

  return (
    <div className="relative flex flex-col h-full min-w-0 bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 group">
      {/* Invisible link covering the entire card for better UX */}
      <LocalLink
        href={url}
        className="absolute inset-0 z-10"
        aria-label={`${t.viewDetails}: ${room.name}`}
      />

      <div className="relative h-64 shrink-0 overflow-hidden bg-muted">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>

      <div className="@container p-5 flex flex-col grow min-w-0">
        <Heading className="font-serif text-2xl font-bold text-foreground mb-3 break-words">
          {room.name}
        </Heading>

        <ul className="space-y-1.5 text-sm text-foreground mb-3">
          {room.capacity != null && room.capacity > 0 && (
            <li className="flex items-start gap-2">
              <Users aria-hidden="true" className="w-4 h-4 mt-0.5 text-primary shrink-0" />
              <span>
                {t.upTo} {room.capacity} {room.capacity === 1 ? t.guest : t.guests}
              </span>
            </li>
          )}
          {bedLabel && (
            <li className="flex items-start gap-2">
              <BedDouble aria-hidden="true" className="w-4 h-4 mt-0.5 text-primary shrink-0" />
              <span className="min-w-0 break-words">{bedLabel}</span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <BathroomIcon aria-hidden="true" className="w-4 h-4 mt-0.5 text-primary shrink-0" />
            <span className="min-w-0 break-words">{bathroom.labels[locale]}</span>
          </li>
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-4 border-t border-border @min-[20rem]:flex-row @min-[20rem]:items-center">
          <div className="min-w-0 @min-[20rem]:flex-1">
            <p className="text-2xl font-bold text-foreground break-words">
              S/ {room.price}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t.priceBasis}
            </p>
          </div>

          {/* Virtual button (visual only, the invisible link handles navigation) */}
          <div className="relative z-20 bg-primary-500 text-primary-foreground px-4 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 min-h-11 w-full @min-[20rem]:w-auto shrink-0 text-center pointer-events-none group-hover:bg-primary-600">
            {t.viewDetails}
            <ArrowRight className="w-4 h-4 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
}

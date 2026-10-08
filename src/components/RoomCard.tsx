import Image from "next/image";
import { ArrowRight, BedDouble, Users } from "lucide-react";
import { LocalLink } from "./LocaleLink";
import type { Room } from "@/payload-types";
import { bedLabels } from "@/data/bedLabels";
import { bathroomTypes } from "@/data/bathroomTypes";

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

export function RoomCard({ room, locale }: { room: Room; locale: Locales }) {
  const t = dictionary[locale] || dictionary.es;
  const bedLabel = bedLabels[locale]?.[room.bedConfiguration];
  const bathroom = bathroomTypes[room.bathroomType];
  const BathroomIcon = bathroom.icon;

  const firstGalleryItem = room.gallery?.[0]?.image;
  const imageUrl =
    typeof firstGalleryItem === "object" ? firstGalleryItem.url : "";
  const imageAlt =
    typeof firstGalleryItem === "object" ? firstGalleryItem.alt : room.name;

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
            alt={imageAlt || "Habitación"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>

      <div className="p-6 flex flex-col grow min-w-0">
        <h3 className="font-serif text-2xl font-bold text-foreground mb-4 break-words">
          {room.name}
        </h3>

        <ul className="space-y-2 text-sm text-foreground mb-4">
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

        {room.shortDescription && (
          <p className="text-muted-foreground text-sm leading-relaxed break-words mb-6">
            {room.shortDescription}
          </p>
        )}

        <div className="mt-auto flex flex-col gap-4 pt-5 border-t border-border">
          <div>
            <p className="text-2xl font-bold text-foreground">
              S/ {room.price}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {t.priceBasis}
            </p>
          </div>

          {/* Virtual button (visual only, the invisible link handles navigation) */}
          <div className="relative z-20 bg-primary-500 text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 pointer-events-none group-hover:bg-primary-600">
            {t.viewDetails}
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

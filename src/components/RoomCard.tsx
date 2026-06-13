import Image from "next/image";
import { DynamicIcon } from "./DynamicIcon";
import { ArrowRight } from "lucide-react";
import { LocalLink } from "./LocaleLink";
import { Room } from "@/payload-types";

const dictionary = {
  es: {
    from: "Desde",
    perNight: "/ noche",
    viewDetails: "Ver detalles",
    featured: "Destacado",
  },
  en: {
    from: "From",
    perNight: "/ night",
    viewDetails: "View details",
    featured: "Featured",
  },
};

export function RoomCard({ room, locale }: { room: Room; locale: Locales }) {
  const t = dictionary[locale] || dictionary.es;

  const firstGalleryItem = room.gallery?.[0]?.image;
  const imageUrl =
    typeof firstGalleryItem === "object" ? firstGalleryItem.url : "";
  const imageAlt =
    typeof firstGalleryItem === "object" ? firstGalleryItem.alt : room.name;

  const url = `/room/${room.slug}`;

  return (
    <div className="relative flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 group">
      {/* Invisible link covering the entire card for better UX */}
      <LocalLink
        href={url}
        className="absolute inset-0 z-10"
        aria-label={`Ver detalles de ${room.name}`}
      />

      <div className="relative h-64 overflow-hidden bg-muted">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt || "Habitación"}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}

        {/* Optional label (if you have a 'featured' field or similar) */}
        {/* {room.featured && (
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-bold uppercase tracking-wider text-foreground rounded-md z-20 shadow-sm">
            {t.featured}
          </div>
        )} */}
      </div>

      <div className="p-6 flex flex-col grow">
        <h3 className="font-serif text-2xl font-bold text-foreground mb-3 group-hover:text-primary-500 transition-colors">
          {room.name}
        </h3>

        {/* Dynamic amenities (Max 3 to maintain layout consistency) */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground mb-4">
            {room.amenities.slice(0, 3).map((amenity) => {
              if (typeof amenity === "number") {
                return null;
              }
              return (
                <div key={amenity.id} className="flex items-center gap-1.5">
                  <DynamicIcon
                    name={amenity.icon || ""}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="truncate max-w-30">
                    {typeof amenity === "object" ? amenity.name : ""}
                  </span>
                </div>
              );
            })}
            {room.amenities.length > 3 && (
              <span className="text-xs font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                +{room.amenities.length - 3}
              </span>
            )}
          </div>
        )}

        {room.shortDescription && (
          <p className="text-muted-foreground text-sm line-clamp-2 mb-6">
            {room.shortDescription}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between pt-5 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground uppercase font-bold mb-0.5">
              {t.from || "Desde"}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-foreground">
                S/ {room.price}
              </span>
              <span className="text-sm text-muted-foreground">
                {t.perNight || "/ noche"}
              </span>
            </div>
          </div>

          {/* Virtual button (visual only, the invisible link handles navigation) */}
          <div className="relative z-20 bg-primary-500 text-primary-foreground px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 pointer-events-none group-hover:bg-primary-600">
            {t.viewDetails || "Ver detalles"}
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

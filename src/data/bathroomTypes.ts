import { Bath, type LucideIcon } from "lucide-react";
import type { Room } from "@/payload-types";

export const bathroomTypes = {
  private: {
    labels: { es: "Baño privado", en: "Private bathroom" },
    icon: Bath,
  },
  shared: {
    labels: { es: "Baño compartido", en: "Shared bathroom" },
    icon: Bath,
  },
} satisfies Record<Room["bathroomType"], {
  labels: Record<Locales, string>;
  icon: LucideIcon;
}>;

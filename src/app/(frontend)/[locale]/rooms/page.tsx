import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import { RoomCard } from "@/components/RoomCard";
import { SITE_URL } from "@/lib/site-url";

type Props = {
  params: Promise<{ locale: string }>;
};

const dictionary = {
  es: {
    title: "Nuestras habitaciones",
    description:
      "Compara nuestras opciones y elige la habitación que mejor se adapte a tu estadía en Cusco.",
    empty: "No hay habitaciones para mostrar por el momento.",
  },
  en: {
    title: "Our rooms",
    description:
      "Compare our options and choose the room that best suits your stay in Cusco.",
    empty: "There are no rooms to display at the moment.",
  },
};

function getValidLocale(locale: string): Locales {
  if (locale !== "es" && locale !== "en") {
    notFound();
  }

  return locale;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = getValidLocale(rawLocale);
  const t = dictionary[locale];

  return {
    title: `${t.title} | Los Licenciados Cusco`,
    description: t.description,
    alternates: {
      canonical: `${SITE_URL}/${locale}/rooms`,
      languages: {
        es: `${SITE_URL}/es/rooms`,
        en: `${SITE_URL}/en/rooms`,
      },
    },
  };
}

export default async function RoomsPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale = getValidLocale(rawLocale);
  const t = dictionary[locale];
  const payload = await getPayload({ config: configPromise });

  const { docs: rooms } = await payload.find({
    collection: "rooms",
    locale,
    pagination: false,
  });

  return (
    <div className="bg-muted min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-4xl mx-auto">
            {t.description}
          </p>
        </div>

        {rooms.length === 0 ? (
          <p className="text-center text-muted-foreground">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

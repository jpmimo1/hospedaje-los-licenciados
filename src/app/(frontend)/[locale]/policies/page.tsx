import { getPayload } from "payload";
import configPromise from "@payload-config";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Clock, Ban, ShieldAlert, Dog, CigaretteOff } from "lucide-react";
import type { Metadata } from "next";

// 1. Diccionario bilingüe para los textos estáticos y SEO
const dictionary = {
  es: {
    seoTitle: "Políticas y Reglas | Los Licenciados Cusco",
    seoDesc:
      "Conoce nuestras políticas de alojamiento, horarios de check-in/out y normas de convivencia para una estadía perfecta en Cusco.",
    title: "Políticas del Hospedaje",
    subtitle:
      "Información importante para garantizar una estadía placentera para todos nuestros huéspedes.",
  },
  en: {
    seoTitle: "Policies & Rules | Los Licenciados Cusco",
    seoDesc:
      "Learn about our accommodation policies, check-in/out times, and house rules for a perfect stay in Cusco.",
    title: "Accommodation Policies",
    subtitle:
      "Important information to ensure a pleasant stay for all our guests.",
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

// 2. Metadatos Dinámicos para SEO Internacional
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = dictionary[locale as "es" | "en"] || dictionary.es;

  return {
    title: t.seoTitle,
    description: t.seoDesc,
  };
}

// Mapa de íconos (No necesita traducción porque los íconos son universales)
const iconMap: any = {
  clock: Clock,
  ban: Ban,
  shield: ShieldAlert,
  dog: Dog,
  smoking: CigaretteOff,
};

export default async function PoliciesPage({ params }: Props) {
  // 3. Obtenemos el idioma actual
  const { locale } = await params;
  const t = dictionary[locale as "es" | "en"] || dictionary.es;

  const payload = await getPayload({ config: configPromise });

  // 4. Pedimos las políticas a la base de datos filtrando por el idioma
  const { docs: policies } = await payload.find({
    collection: "policies",
    locale: locale as any, // <-- ¡Clave para que Payload devuelva el idioma correcto!
    sort: "createdAt",
  });

  return (
    <div className="bg-background min-h-screen py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t.title}
          </h1>
          <p className="text-muted-foreground text-lg">{t.subtitle}</p>
        </div>

        <div className="space-y-12">
          {policies.map((policy) => {
            const IconComponent = iconMap[policy.icon as string] || ShieldAlert;
            return (
              <div
                key={policy.id}
                className="flex flex-col md:flex-row gap-8 pb-12 border-b border-border last:border-0"
              >
                <div className="md:w-1/3 flex items-start">
                  <div className="gap-4 flex items-center">
                    <div className="bg-primary/10 p-3 rounded-xl text-primary-600">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    {/* El título de la política ya viene traducido desde Payload */}
                    <h2 className="font-serif text-2xl font-bold text-foreground">
                      {policy.title}
                    </h2>
                  </div>
                </div>
                {/* El contenido de Lexical (RichText) también viene en el idioma correcto */}
                <div className="md:w-2/3 prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
                  <RichText data={policy.content} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

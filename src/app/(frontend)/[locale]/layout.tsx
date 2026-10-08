import { Inter, Lora } from "next/font/google";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "../../globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return locale === "en"
    ? {
        title: "Los Licenciados Guesthouse | Cusco",
        description: "Your family-run guesthouse in San Sebastián, Cusco.",
      }
    : {
        title: "Hospedaje Los Licenciados | Cusco",
        description: "Tu hospedaje familiar en San Sebastián, Cusco.",
      };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${lora.variable} scroll-smooth`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="font-sans bg-background text-foreground antialiased flex flex-col min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header locale={locale as Locales} />
          <main className="grow">{children}</main>
          <Footer locale={locale as Locales} />
        </ThemeProvider>
      </body>
    </html>
  );
}

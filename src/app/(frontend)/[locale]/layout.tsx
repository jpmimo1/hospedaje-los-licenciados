import { Inter, Lora } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "../../globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";

// 1. Configuramos las fuentes y sus variables CSS
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

export const metadata = {
  title: "Hospedaje Los Licenciados | Cusco",
  description: "Tu hogar en el corazón de Cusco",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale;

  return (
    // 2. Inyectamos las variables en la etiqueta HTML
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

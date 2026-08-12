import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "WatchParty — El partido se vive acompañado",
    description: "Comentá, calificá y compartí cada partido en tiempo real con la comunidad WatchParty.",
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: {
      title: "WatchParty — El partido se vive acompañado",
      description: "La segunda pantalla del fútbol: salas en vivo, calificaciones y comunidad.",
      type: "website",
      url: origin,
      images: [{ url: `${origin}/og.png`, width: 1734, height: 907, alt: "WatchParty — El partido se vive acompañado" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "WatchParty — El partido se vive acompañado",
      description: "Salas en vivo, calificaciones y comunidad para fanáticos del fútbol.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body className={`${inter.variable} ${sora.variable}`}>{children}</body></html>;
}

import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { InlineScript } from "@/components/app/InlineScript";
import { Providers } from "@/components/providers/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { Backdrop } from "@/components/ui/Backdrop";
import { SHARED_OPEN_GRAPH, SHARED_TWITTER, SITE } from "@/lib/seo/site";
import { structuredData } from "@/lib/seo/structuredData";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });

/** Defaults for every page; each page adds its own through `pageMetadata`. No canonical here, or every page would inherit "/". */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { ...SHARED_OPEN_GRAPH, title: SITE.title, description: SITE.description },
  twitter: { ...SHARED_TWITTER, title: SITE.title, description: SITE.description },
  icons: {
    icon: [
      { url: "/image/dexisphere-icon100.png", type: "image/png", sizes: "100x100" },
      { url: "/image/dexisphere-icon512.png", type: "image/png", sizes: "512x512" },
    ],
    // Opaque: iOS paints a transparent icon's gaps black.
    apple: { url: "/image/apple-touch-icon.png", sizes: "180x180" },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: SITE.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: SITE.themeColor.dark },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geist.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}
    >
      <head>
        <InlineScript html={THEME_BOOT_SCRIPT} />
        <JsonLd data={structuredData()} />
      </head>
      <body className="min-h-full bg-ground text-ink">
        <Backdrop />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

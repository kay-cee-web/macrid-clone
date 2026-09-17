import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { InlineScript } from "@/components/app/InlineScript";
import { Providers } from "@/components/providers/Providers";
import { Backdrop } from "@/components/ui/Backdrop";
import { THEME_BOOT_SCRIPT } from "@/lib/theme";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "Dexisphere Agents", template: "%s · Dexisphere Agents" },
  description: "AI agents that do your marketing and sales busywork.",
  icons: {
    icon: [
      { url: "/image/dexisphere-icon100.png", type: "image/png", sizes: "100x100" },
      { url: "/image/dexisphere-icon512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: { url: "/image/dexisphere-icon512.png", sizes: "512x512" },
  },
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
      </head>
      <body className="min-h-full bg-ground text-ink">
        <Backdrop />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

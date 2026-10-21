import type { Metadata } from "next";
import { Exo, Inter } from "next/font/google";

import { JsonLd } from "@/components/seo/json-ld";
import { site } from "@/content/site";
import { preloaderSkipScript } from "@/lib/preloader";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const exo = Exo({ variable: "--font-exo", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Digital Marketing Agency for Local Businesses`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: { siteName: site.name, type: "website" },
  twitter: { card: "summary_large_image" },
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  legalName: site.legalName,
  url: site.url,
  logo: `${site.url}/brand/skopos-codex-logo.svg`,
  description: site.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${exo.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloaderSkipScript }} />
      </head>
      <body className="antialiased">
        <JsonLd data={organizationLd} />
        {children}
      </body>
    </html>
  );
}

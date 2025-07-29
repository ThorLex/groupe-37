import type { Metadata } from "next"
import "./globals.css"
import { Audiowided, OpenSans } from "./fonts"
import ClientWrapper from "@/components/ClientWrapper"

export const metadata: Metadata = {
  title: {
    template: "%s | IDExpress",
    default: "Demande de CNI en ligne - IDExpress Cameroun"
  },
  description: "Plateforme officielle de demande de Carte Nationale d'Identité en ligne au Cameroun. Procédure rapide, sécurisée et sans déplacement.",
  keywords: [
    "cni cameroun", 
    "demande cni en ligne", 
    "carte identité cameroun", 
    "renouvellement cni", 
    "identité numérique cameroun",
    "document identité cameroun"
  ],
  authors: [{ name: "Ministère de l'Administration Territoriale", url: "https://www.minat.cm" }],
  openGraph: {
    title: "IDEXPress - Service CNI en ligne",
    description: "Demande et suivi de votre Carte Nationale d'Identité Camerounaise 100% en ligne",
    url: "https://www.idexpress.cm",
    siteName: "IDEXPress",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Plateforme CNI en ligne Cameroun",
      }
    ],
    locale: 'fr_CM',
    type: 'website',
  },
  twitter: {
    card: "summary_large_image",
    title: "IDEXPress - Service CNI en ligne",
    description: "Réalisez votre demande de CNI sans vous déplacer - Service officiel du Cameroun",
    images: ["https://www.idexpress.cm/twitter-card.jpg"],
  },
  themeColor: "#009739",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body
        className={`${Audiowided.variable} ${OpenSans.variable} antialiased min-h-screen flex flex-col`}
      >
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  )
}
import type { Metadata } from "next";
import "../app/globals.css";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/store/ReduxProvider";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: {
    default: "Neo Design Studio",
    template: "%s | Neo Design Studio",
  },
  description:
    "Neo Design Studio has been operating since 2021, delivering over 300 design projects with carefully selected modern styles and professional design solutions.",
  themeColor: "#000000",
  colorScheme: "dark",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", type: "image/png", sizes: "96x96" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [
      {
        url: "/web-app-manifest-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/web-app-manifest-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
  manifest: "/site.webmanifest",

  openGraph: {
    title: "Neo Design Studio",
    description:
      "Neo Design Studio has been operating since 2021, delivering over 300 design projects with carefully selected modern styles and professional design solutions.",
    url: "https://neodesignstudio.az",
    siteName: "Neo Design Studio",
    images: [
      {
        url: "https://opengraph.b-cdn.net/production/images/af8a8f82-1e9d-494b-b089-c0dcd9b167a3.png?token=meOGm2HIVgkasQjQCiOeRHVzIjjYuUxg46EHmbXWf6w&height=675&width=1200&expires=33281684945",
        width: 1200,
        height: 630,
        alt: "Neo Design Studio Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <ReduxProvider>
            <Navbar />
            {children}
            <Footer />
          </ReduxProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}

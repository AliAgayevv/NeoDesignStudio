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
  title: "Neo Design Studio",
  themeColor: "#000000",
  colorScheme: "dark",
  appleWebApp: {
    title: "Neo Design Studio",
    statusBarStyle: "black-translucent",
    capable: true,
    startupImage: [
      { url: "/apple-touch-icon.png", media: "(device-width: 375px)" },
      { url: "/apple-touch-icon.png", media: "(device-width: 768px)" },
    ],
  },
  description:
    "Neo Design Studio is a design studio that specializes in creating beautiful and innovative interior and exterior spaces.",
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
      "Neo Design Studio is a design studio that specializes in creating beautiful and innovative interior and exterior spaces.",
    url: "https://neodesignstudio.az",
    siteName: "Neo Design Studio",
    images: [
      {
        url: "/favicon.svg",
        width: 1200,
        height: 630,
        alt: "Neo Design Studio Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Neo Design Studio",
    description:
      "Neo Design Studio is a design studio that specializes in creating beautiful and innovative interior and exterior spaces.",
    images: ["/favicon.svg"],
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

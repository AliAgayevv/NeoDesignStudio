import type { Metadata } from "next";
import "../app/globals.css";
import Navbar from "@/components/Navbar";
import ReduxProvider from "@/store/ReduxProvider"; // Redux Provider'ı import ettik
import Footer from "@/components/Footer";

type RootLayoutProps = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: "Neo Design Studio",
  description:
    "Neo Design Studio is a design studio that specializes in creating beautiful and innovative interior and exterior spaces.",
  icons: {
    icon: [
      { url: "/frontend/public/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png" }],
  },
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Navbar />
          {children}
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}

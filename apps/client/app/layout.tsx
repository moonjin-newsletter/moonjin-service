import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/layout/Header";
import ClientProvider from "./ClientProvider";
import { Libre_Baskerville, Noto_Serif_KR } from "next/font/google";
import Footer from "../components/layout/Footer";

export const metadata: Metadata = {
  title: "moonjin",
  description: "작가와 독자의 연결",
};

const libre = Libre_Baskerville({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre",
  weight: ["400", "700"],
});

const notoSerifKR = Noto_Serif_KR({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-serif",
  weight: ["200", "300", "400", "500", "600", "700", "900"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en" className={`${libre.variable} ${notoSerifKR.variable}`}>
      <body className={`flex min-h-screen flex-col w-full h-full `}>
        <ClientProvider>
          <Header />

          {children}
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}

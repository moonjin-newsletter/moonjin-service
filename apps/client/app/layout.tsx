import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/layout/Header";
import ClientProvider from "./ClientProvider";
import { Libre_Baskerville, Noto_Serif_KR } from "next/font/google";
import Head from "next/head";

export const metadata: Metadata = {
  title: "moonjin",
  description: "작가와 독자의 연결",
};

const libre = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre",
  weight: ["400", "700"],
});

const serif = Noto_Serif_KR({
  subsets: ["latin"],
  preload: false,
  variable: "--font-serif",
  weight: ["200", "300", "400", "500", "600", "700", "900"],
});

const FontGoogleLayout = (props: { children: any }) => {
  return (
    <div className={libre.variable}>
      <div className={serif.variable}>{props.children}</div>
    </div>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={`flex min-h-screen flex-col w-full h-full `}>
        <ClientProvider>
          <FontGoogleLayout>
            <Header />
            {children}
          </FontGoogleLayout>
        </ClientProvider>
      </body>
    </html>
  );
}

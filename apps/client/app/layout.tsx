import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Libre_Baskerville, Noto_Serif_KR } from "next/font/google";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ClientProvider from "./ClientProvider";

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

// const notoSerifKR = Noto_Serif_KR({
//   subsets: ["latin"],
//   display: "swap",
//   variable: "--font-noto-serif",
//   weight: ["200", "300", "400", "500", "600", "700", "900"],
// });

export const viewport: Viewport = {
  width: "device-width",
  userScalable: true,
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html className={`${libre.variable} `} lang="en">
      <head>
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          href="https://cdn.rawgit.com/kattergil/NotoSerifKR-Web/5e08423b/stylesheet/NotoSerif-Web.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body
        className={`flex min-h-screen flex-col text-grayscale-700 w-full h-full min-w-[1006px] `}
      >
        <ClientProvider>
          <Header />
          {children}
          {/*<Footer />*/}
        </ClientProvider>
      </body>
    </html>
  );
}

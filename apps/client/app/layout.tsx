import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Libre_Baskerville, Noto_Serif_KR } from "next/font/google";
import ClientProvider from "./ClientProvider";
import { Analytics } from "@vercel/analytics/react";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://www.moonjin.site"),
  title: "문진",
  description: "어제, 오늘 그리고 내일의 이야기를 담는 공간, 문진 뉴스레터",
  openGraph: {
    type: "website",
    title: "문진",
    description: "어제, 오늘 그리고 내일의 이야기를 담는 공간, 문진 뉴스레터",
    url: "https://www.moonjin.site",
    siteName: "문진",
    images: [
      {
        url: "https://www.moonjin.site/og-image.png",
        width: 800,
        height: 400,
        alt: "문진",
        type: "image/png",
      },
    ],
  },
  category: "newsletter",
  keywords: [
    "뉴스레터",
    "문진",
    "글",
    "이야기",
    "moonjin",
    "메일",
    "인기 뉴스레터",
  ],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },

  appleWebApp: {
    capable: true,
  },
};

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
    <html className={`${libre.variable} ${notoSerifKR.variable} `} lang="ko">
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
        className={`flex min-h-screen flex-col text-grayscale-700 w-full min-w-[1006px] `}
      >
        <ClientProvider>
          {children}
          {/*<Footer />*/}
        </ClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

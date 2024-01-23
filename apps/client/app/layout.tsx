import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/layout/Header";
import ClientProvider from "./ClientProvider";
import { Libre_Baskerville } from "next/font/google";

export const metadata: Metadata = {
  title: "moonjin",
  description: "작가와 독자의 연결",
};

const libre = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre",
  weight: ["400", "700"],
});

const FontGoogleLayout = (props: { children: any }) => {
  return <div className={libre.variable}>{props.children}</div>;
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

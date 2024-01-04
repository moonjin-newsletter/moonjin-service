import "./globals.css";
import type { Metadata } from "next";
import Header from "../components/layout/Header";
import ClientProvider from "./ClientProvider";

export const metadata: Metadata = {
  title: "moonjin",
  description: "작가와 독자의 연결",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className="flex flex-col w-full h-full">
        <ClientProvider>
          <Header />
          {children}
        </ClientProvider>
      </body>
    </html>
  );
}

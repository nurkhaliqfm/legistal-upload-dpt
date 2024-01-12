import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistem Upload DPT Legistal | Hadin ITE Solution",
  description: "Sistem Upload DPT Legistal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/unhas.svg" />
      </head>
      <body className={inter.className}>
        <main className="flex h-screen">
          {/* <Sidebar /> */}
          <div className="flex flex-col flex-1 p-4 md:p-7 lg:ml-0 overflow-x-hidden">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </main>
      </body>
    </html>
  );
}

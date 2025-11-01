import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import Navbar from "@/components/Navbar";
import Head from "next/head";

const font = Raleway({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CollabSpace",
  description: "just chat with people",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="../public/favicon.ico" />
      </Head>
      <body
        className={`${font.className} antialiased flex flex-col bg-neutral-950 text-white border-white w-screen h-screen`}
      >
        <AuthProvider>
          <div className="w-full h-full flex flex-row lg:flex-col">
            <Navbar />
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

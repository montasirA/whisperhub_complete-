import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/theme/ThemeProvider";
import ThemeToggle from "@/components/theme/ThemeToggle";

import { AuthProvider } from "@/context/AuthContext";

import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "WhisperHub",
  description:
    "A modern anonymous social platform for authentic conversations.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >

      <body className="min-h-full flex flex-col bg-[var(--page-gradient)] text-[var(--text)] transition-colors duration-300">


        <ThemeProvider>

          <AuthProvider>

            <ThemeToggle />

            {children}

          </AuthProvider>

        </ThemeProvider>


      </body>

    </html>

  );

}
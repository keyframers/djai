import type { Metadata } from "next";
import { Smooch_Sans } from "next/font/google";
import "./globals.css";

const smooch = Smooch_Sans({
  variable: "--font-smooch-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DJai",
  description: "Your musical helper.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${smooch.variable} ${smooch.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

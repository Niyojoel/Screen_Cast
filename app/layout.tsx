import type { Metadata } from "next";
// import { Karla } from "next/font/google";
import "./globals.css";
import { satoshi } from "../fonts/font";

//cannot be pulled without internet
// const geistKarla = Karla({
//   variable: "--font-geist-karla",
//   subsets: ["latin"],
// });
//

export const metadata: Metadata = {
  title: "ScreenCast",
  description: "A Screen Recording and Sharing App",
  icons: {
    icon: "/assets/icons/logo.svg",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${satoshi.variable}`}
      >
        {children}
      </body>
    </html>
  );
}


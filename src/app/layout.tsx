import type { Metadata, Viewport } from "next";
import { Caveat, Inter, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Helsinki 20.–23. august · Consocio",
  description:
    "Programmet for Consocios tur til Helsinki: mad, saunaer, nationalpark, kort med ruter og budgettet.",
  openGraph: {
    title: "Helsinki 20.–23. august · Consocio",
    description:
      "Programmet for Consocios tur til Helsinki: mad, saunaer, nationalpark, kort med ruter og budgettet.",
    type: "website",
    locale: "da_DK",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f1ec" },
    { media: "(prefers-color-scheme: dark)", color: "#100f0e" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // The font variables must land on :root — globals.css builds the font
    // stacks from them there.
    <html
      lang="da"
      className={`${inter.variable} ${newsreader.variable} ${caveat.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}

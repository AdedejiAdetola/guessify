// fonts.js
import { Andika } from "next/font/google";
import localFont from "next/font/local";

// Import and configure Handjet from Google Fonts
export const handjet = Andika({
  weight: ["400", "700"], // Specify the weights you need
  subsets: ["latin"],
  display: "swap",
});

// Define local fonts
export const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

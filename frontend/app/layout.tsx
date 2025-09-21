import "./globals.css";
import { ReactNode } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export const metadata = {
  title: "LegalEase AI",
  description: "Upload contracts. Get clarity in seconds.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <NavBar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

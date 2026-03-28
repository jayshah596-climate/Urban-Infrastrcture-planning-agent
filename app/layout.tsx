import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Urban Infrastructure Planning Agent",
  description: "AI-powered city master plan generator for water, wastewater, transport, roads, and green infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useState } from "react";
import DocsDrawer from "@/components/DocsDrawer";

export const metadata: Metadata = {
  title: "MetaRoute - Documentation",
  description: "API framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white">
        <Navbar />
        <DocsDrawer>{children}</DocsDrawer>
      </body>
    </html>
  );
}

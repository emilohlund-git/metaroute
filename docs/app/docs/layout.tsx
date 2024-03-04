"use client";

import "../globals.css";
import Navbar from "@/components/Navbar";
import DocsDrawer from "@/components/DocsDrawer";
import { DrawerProvider } from "@/context/DrawerProvider";

export default function DrawerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <DrawerProvider>
          <Navbar />
          <DocsDrawer>{children}</DocsDrawer>
        </DrawerProvider>
      </body>
    </html>
  );
}

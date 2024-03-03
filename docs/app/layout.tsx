import type { Metadata } from "next";
import "./globals.css";
import { DrawerProvider } from "@/context/DrawerProvider";

export const metadata: Metadata = {
  title: "MetaRoute",
  description: "API framework",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <DrawerProvider>
        <body className="">{children}</body>
      </DrawerProvider>
    </html>
  );
}

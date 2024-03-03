import type { Metadata } from "next";
import "../globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

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
      <body>
        <Navbar />
        <div className="drawer lg:drawer-open">
          <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content bg-base-200 flex flex-col items-center">
            <div className="flex h-full flex-grow overflow-hidden mt-16">
              {children}
            </div>
            <div className="w-full h-20 bg-base-content py-8 px-20">
              Copyright © 2024 MIT by{" "}
              <span className="font-extrabold">Emil Ölund</span>
            </div>
          </div>
          <div className="drawer-side">
            <ul className="menu p-4 w-80 min-h-full bg-base-300 text-base-content">
              <Sidebar />
            </ul>
          </div>
        </div>
      </body>
    </html>
  );
}

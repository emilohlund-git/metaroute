"use client";

import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { useDrawer } from "@/context/DrawerProvider";

type Props = {
  children: ReactNode;
};

export default function DocsDrawer({ children }: Props) {
  const { isDrawerOpen, setDrawerOpen } = useDrawer();

  return (
    <div className={`drawer bg-base-200 ${isDrawerOpen ? "drawer-open" : ""}`}>
      <input
        id="sidebar-drawer"
        type="checkbox"
        checked={isDrawerOpen}
        className="drawer-toggle"
        onChange={() => setDrawerOpen(!isDrawerOpen)}
      />
      <div className="drawer-content w-full bg-base-200 flex flex-col items-center">
        <div className="flex h-full overflow-hidden mt-16">{children}</div>
        <div className="w-full h-20 bg-gradient-to-r from-primary-content to-neutral-800 py-8 px-20">
          Copyright © 2024 MIT by{" "}
          <span className="font-extrabold">Emil Ölund</span>
        </div>
      </div>
      <div className="drawer-side">
        <ul className="menu p-4 w-80 min-h-full bg-base-300 text-base-content z-30">
          <Sidebar />
        </ul>
      </div>
    </div>
  );
}
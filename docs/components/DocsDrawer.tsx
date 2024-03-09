"use client";

import { ReactNode, lazy, useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import { useDrawer } from "@/context/DrawerProvider";
import { DocsFooter } from "./DocsFooter";
import Navbar from "./Navbar";

type Props = {
  children: ReactNode;
  frameworkVersions: any[];
};

const dynamicImportDocPage = (pageName: string) => {
  return lazy(() => import(`../components/pages/${pageName}`));
};

const WelcomePage = dynamicImportDocPage("Welcome");

export default function DocsDrawer({ children, frameworkVersions }: Props) {
  const [activeTab, setActiveTab] = useState("Welcome");
  const [ActivePage, setActivePage] = useState(() => WelcomePage);
  const { isDrawerOpen, setDrawerOpen } = useDrawer();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically import the active tab's component
    const loadActivePage = async () => {
      const ImportedPage = dynamicImportDocPage(activeTab);
      setActivePage(() => ImportedPage);
    };

    loadActivePage();
  }, [activeTab]);

  return (
    <>
      <Navbar setActiveTab={setActiveTab} versions={frameworkVersions} />
      <div
        className={`drawer bg-base-200 ${isDrawerOpen ? "drawer-open" : ""}`}
      >
        <input
          id="sidebar-drawer"
          type="checkbox"
          checked={isDrawerOpen}
          className="drawer-toggle"
          onChange={() => setDrawerOpen(!isDrawerOpen)}
        />
        <div className="drawer-content w-full bg-base-200 flex flex-col items-center">
          <div role="tablist" className="flex h-full overflow-hidden mt-16">
            <ActivePage />
          </div>
          <DocsFooter />
        </div>
        <div ref={sidebarRef} className="drawer-side">
          <ul className="menu p-4 w-80 min-h-full bg-base-300 text-base-content z-30">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </ul>
        </div>
      </div>
    </>
  );
}

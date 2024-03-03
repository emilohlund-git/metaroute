"use client";

import { createContext, useContext, useState } from "react";

const DrawerContext = createContext({
  isDrawerOpen: false,
  setDrawerOpen: (value: boolean) => {},
});

type Props = {
  children: React.ReactNode;
};

export function DrawerProvider({ children }: Props) {
  const [isDrawerOpen, setDrawerOpen] = useState<boolean>(true);

  return (
    <DrawerContext.Provider value={{ isDrawerOpen, setDrawerOpen }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
}

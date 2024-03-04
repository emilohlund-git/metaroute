"use client";

import ReduxProvider from "@/app/store/StoreProvider";

type Props = {
  children: React.ReactNode;
};

export default function ReduxWrapper({ children }: Props) {
  return <ReduxProvider>{children}</ReduxProvider>;
}

import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DocsContainer({ children }: Props) {
  return (
    <div className="max-w-full mx-auto px-20 py-8 text-base-content">
      {children}
    </div>
  );
}

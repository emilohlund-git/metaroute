import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
  id?: string;
};

export default function DocsSection({ children, id }: Props) {
  return (
    <section id={id} className="mb-8">
      <article className="prose-base">{children}</article>
    </section>
  );
}

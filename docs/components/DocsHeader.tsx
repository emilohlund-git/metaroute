import React from "react";
import SmoothScrollLink from "./SmoothScrollLink";

type Props = {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export default function DocsHeader({ text, level = 2 }: Props) {
  const id = text.toLowerCase().replace(/ /g, "-");
  const HeaderTag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <HeaderTag className={`text-${level + 1}xl font-bold mb-4`}>
      <SmoothScrollLink id={id} href={`#${id}`}>
        <span className="text-lg text-neutral-400 cursor-pointer hover:text-neutral-500">
          #
        </span>{" "}
        {text}
      </SmoothScrollLink>
    </HeaderTag>
  );
}

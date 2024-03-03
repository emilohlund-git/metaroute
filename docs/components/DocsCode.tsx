import React, { ReactNode } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  children: ReactNode;
  language?: string;
};

export default function DocsCode({ children, language = "typescript" }: Props) {
  return (
    <SyntaxHighlighter
      customStyle={{
        borderRadius: "10px",
        padding: "1rem",
        overflow: "auto",
        lineHeight: "1.5",
      }}
      codeTagProps={{
        style: { fontSize: "15px" },
      }}
      language={language}
      style={vscDarkPlus}
    >
      {children as string}
    </SyntaxHighlighter>
  );
}

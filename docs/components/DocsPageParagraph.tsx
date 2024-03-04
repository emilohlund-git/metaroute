type Props = {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  color?: string;
  italic?: boolean;
};

export function DocsPageParagraph({ children, italic, color = "", size = "lg" }: Props) {
  return (
    <p className={`text-${size} ${color} ${italic ? "italic" : ""} mt-4`}>
      {children}
    </p>
  );
}

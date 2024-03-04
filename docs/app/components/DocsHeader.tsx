import SmoothScrollLink from "./SmoothScrollLink";

type Props = {
  text: string;
};

export default function DocsHeader({ text }: Props) {
  const id = text.toLowerCase();

  return (
    <h2 className="text-2xl font-bold mb-4">
      <SmoothScrollLink href={`#${id}`}>
        <span className="text-lg text-neutral-400 cursor-pointer">#</span> {text}
      </SmoothScrollLink>
    </h2>
  );
}

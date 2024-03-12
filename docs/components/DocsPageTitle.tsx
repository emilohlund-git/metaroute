export function DocsPageTitle({
  title,
  emoji
}: {
  title: string
  emoji?: string
}) {
  return (
    <h1 className="text-3xl font-bold mb-4">
      {emoji} {title}
    </h1>
  )
}

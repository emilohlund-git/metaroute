import React, { ReactNode } from 'react'

type Props = {
  snippet: string
}

export default function DocsCodeSnippet({ snippet }: Props) {
  return (
    <code className="bg-gray-100 text-base-200 p-1 rounded-md">{snippet}</code>
  )
}

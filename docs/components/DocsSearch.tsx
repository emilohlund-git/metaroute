'use client'

import React, { useState, useEffect, useRef } from 'react'
import docs from '../docs.json'

type Doc = {
  title: string
  content: string
  url: string
  subtitles: { title: string; url: string }[]
}

type Docs = {
  [key: string]: Doc
}

function searchDoc(docs: Docs, query: string) {
  let results: Doc[] = []

  if (query.trim().length >= 3) {
    const lowerCaseQuery = query.toLowerCase()

    for (let docKey in docs) {
      let doc = docs[docKey]
      let isMatch =
        doc.title.toLowerCase().includes(lowerCaseQuery) ||
        doc.content.toLowerCase().includes(lowerCaseQuery)

      // Check subtitles for matches
      if (doc.subtitles) {
        for (let subtitle of doc.subtitles) {
          if (subtitle.title.toLowerCase().includes(lowerCaseQuery)) {
            isMatch = true
            break
          }
        }
      }

      if (isMatch) {
        results.push(doc)
      }
    }
  }

  return results
}

function DocItem({
  doc,
  setActiveTab,
  setIsOpen,
  level = 0
}: {
  doc: Doc
  setActiveTab: {
    (id: string): void
  }
  setIsOpen: {
    (isOpen: boolean): void
  }
  level?: number
}) {
  return (
    <div
      key={doc.url}
      className={`rounded-l-lg px-4 py-2 text-base-content my-2 ${
        level > 0 ? 'border-l-4 border-base-300 pl-4' : ''
      }`}
    >
      <div className="hover:bg-base-300 curosr-p p-4 rounded-2xl transition-all">
        <div
          className="cursor-pointer"
          id={doc.title.replace(/ /g, '-').toLowerCase()}
          onClick={() => {
            setActiveTab(doc.title.replace(/ /g, ''))
            setIsOpen(false)
          }}
        >
          <h2 className="font-bold">{doc.title}</h2>
          <p>{doc.content.substring(0, 55)}...</p>
        </div>
      </div>
    </div>
  )
}

export function DocsSearch({
  setActiveTab
}: {
  setActiveTab: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Doc[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 3
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (event.target && event.target instanceof Node) {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setIsOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [searchRef])

  useEffect(() => {
    const results = searchDoc(docs, query)
    if (results) {
      const start = (currentPage - 1) * resultsPerPage
      const end = start + resultsPerPage
      setResults(results.slice(start, end))
    }
  }, [query, currentPage])

  const totalPages = Math.ceil(searchDoc(docs, query).length / resultsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div className="text-base-content" ref={searchRef}>
      <label className="input input-bordered outline-none ring-0 bg-transparent flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            if (e.target.value.length >= 3) {
              setIsOpen(true)
            } else {
              setIsOpen(false)
            }
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
      {isOpen && (
        <div className="absolute z-40 bg-base-100 text-neutral-content p-4 rounded-b-xl w-1/2 mt-2 shadow-2xl">
          {results.length > 0 ? (
            <>
              {results.map((doc, index) => (
                <React.Fragment key={index}>
                  <DocItem
                    setIsOpen={setIsOpen}
                    setActiveTab={setActiveTab}
                    doc={doc}
                  />
                  {index < results.length - 1 && (
                    <div className="divider opacity-50 px-4"></div>
                  )}
                </React.Fragment>
              ))}
              <div className="join ml-4 mt-4 mb-4">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`join-item btn ${
                      currentPage === i + 1 ? 'btn-active' : ''
                    }`}
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="text-neutral-content">No results found</div>
          )}
        </div>
      )}
    </div>
  )
}

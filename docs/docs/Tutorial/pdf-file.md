---
sidebar_position: 2
---

# PDF file

> PDF pages are rendered in the browser on demand. Use the [usePDFDocument](/docs/Utils/use-pdf-document) hook to display a document progressively: the first pages are rendered right away, the rest only when the user reaches them.

```tsx
import { useState } from 'react'
import { AnnotationViewer, usePDFDocument } from 'react-mindee-js'

function PdfViewer({ file }: { file: File }) {
  const { status, numPages, pages, loading, loadPage } = usePDFDocument(file)
  const [current, setCurrent] = useState(0)

  const goTo = (index: number) => {
    setCurrent(index)
    loadPage(index) // renders the page and the rest of its batch if needed
  }

  if (status !== 'ready') return <p>{status}</p>

  return (
    <>
      <button onClick={() => goTo(current - 1)} disabled={current === 0}>
        Previous
      </button>
      <span>
        {current + 1} / {numPages}
      </span>
      <button onClick={() => goTo(current + 1)} disabled={current === numPages - 1}>
        Next
      </button>

      {pages[current] ? (
        <AnnotationViewer data={{ image: pages[current], shapes: [] }} />
      ) : (
        <p>{loading.has(current) ? 'Rendering…' : 'Not loaded'}</p>
      )}
    </>
  )
}
```

Outside React, or for custom scheduling, use [openPDF](/docs/Utils/open-pdf) directly:

```ts
const doc = await openPDF(file)
const firstPage = await doc.getPage(1)
// ...
await doc.destroy()
```

:::caution
Page images are `blob:` object URLs that live until the document is destroyed. If you need to send one to a server, read it back with `fetch(url).then((r) => r.blob())` first.
:::

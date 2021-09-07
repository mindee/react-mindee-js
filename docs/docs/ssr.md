---
sidebar_position: 7
---

# Server side rendering

If you're doing server side rendering, there's a good chance that the global window object or similar objects are going to be undefined because that is only something the client will understand.

You may need to use a library like [loadable-components](https://github.com/gregberge/loadable-components) to execute your react-mindee code in the client.

#### Sample code

```jsx
import React from 'react'
import loadable from '@loadable/component'

import dummyImage from 'path-to-your/file.jpg'
import dummyShapes from 'path-to-your-shapes-file'

const AnnotationViewer = loadable(() =>
  import('react-mindee-js').then((module) => module.AnnotationViewer)
)

const data = {
  image: dummyImage,
  shapes: dummyShapes,
}

function App() {
  return <AnnotationViewer data={data} />
}
```

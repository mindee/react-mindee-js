# Image rotation and EXIF

Some images (`.jpg`, `.tiff`, `.webp`...) can embed meta data via [EXIF](https://en.wikipedia.org/wiki/Exif) tags.

Among other useful information, "Orientation" tag value indicates rotation and mirror effects.
See [EXIF specification](https://www.exif.org/Exif2-2.PDF) (page 24)

```
TAG        1        2       3      4

         888888  888888      88  88
         88          88      88  88
RESULT   8888      8888    8888  8888
         88          88      88  88
         88          88  888888  888888
```

```
TAG         5            6           7          8

        8888888888  88                  88  8888888888
RESULT  88  88      88  88          88  88      88  88
        88          8888888888  8888888888          88
```

`react-mindee-js` provides some helpers to both read and apply such information.
Browser support for EXIF tag orientations is coming but not fully supported yet. See ["caniuse" website](https://caniuse.com/#feat=css-image-orientation).

Plus, we want to master EXIF orientation tag within `<canvas>` element.

That's why we provide some extra tools and helpers to extract EXIF orientation tag and apply equivalent transform via `<canvas>`.

## Extracting EXIF orientation tag

Several EXIF tags are available (GPS, Camera details...) but we offer to extract only orientation tag.

You can have a look at [exif-js](https://github.com/exif-js/exif-js) project for a broader support if you need to.

```javascript
import { filesHelper } from 'react-mindee-js'

// const myFile = ... ex coming form a file input: event.target.files[0]
// A file object is expected

filesHelper.readOrientation(myFile).then(orientation => console.log(orientation))
```

Please note that `readOrientation` returns a `Promise` and not directly its orientation.

## Applying orientation transformation

If you want to apply a transformation to apply EXIF indications, we provide the following function:

```javascript
import { filesHelper } from 'react-mindee-js'

filesHelper.applyRotation(myFile, orientation).then(result => {
  // do something with your new Image
})
```

`orientation` is supposed to be a number between 1 and 9.
Incorrect value will resolve in no transformation.

Once again, note that this function returns a promise and not directly a file.

## Convert image completely

To retrieve EXIF tag and apply transformation right away, we provide a third helper function: `getImageUrlWithoutExifTags`.

It will first extract EXIF tag and apply any transform on the image before returning it as dataUrl.
Note that the result is returned as a `Promise`.

Let's see a complete example using `<AnnotationViewer/>` and a minimal react app.

If you need images with EXIF tags, you can find some in `/example/src/imgs` folder.

```javascript
import React, { useState } from 'react'

import { AnnotationViewer, filesHelpers } from 'react-mindee-js'

const App = () => {
  const [myFile, setMyFile] = useState(null)

  const onChange = event => {
    filesHelpers.getImageUrlWithoutExifTags(event.target.files[0]).then(setMyFile)
  }

  return (
    <main>
      <input type='file' onChange={onChange} />
      <div style={{ height: '50vh', width: '50vw' }}>
        {myFile && <AnnotationViewer source={myFile} type='image' predictions={[]} />}
      </div>
    </main>
  )
}

export default App
```

## Applying others rotations transforms

As a convenience, EXIF transform function can also be reused for other purpose. In that sense, you can use `rotateLeft` and `rotateRight` which applies a transformation as if an EXIF tag (value 6 or 8) is provided.

Example:

```javascript
import { filesHelper } from 'react-mindee-js'

filesHelper.rotateLeft(myFile).then(result => {
  // do something with your new Image
})
```

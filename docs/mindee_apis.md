# Making calls to mindee APIs

We provide several components to help you requests our APIs.

Let us introduce a JavaScript class `MindeeAPI` which is a wrapper around a "POST" requests on our APIs:

```javascript
import { MindeeAPI } from 'react-mindee-js'

// Minimal settings
const settings = {
  product: 'expense_receipts',
  version: 'v2',
  token: 'my_token_here'
}
const api = new MindeeAPI(settings)
```

This `api` instance has a `predict` method which accepts a file object and makes a 'POST' request on our API given a correct settings file.

We advise you to keep your mindee token as an environment variable.

If you used [create-react-app](https://github.com/facebookincubator/create-react-app) to start your application, you can store this variable in your `.env` file (you may need to create it) and add the following content:

```bash
REACT_APP_MINDEE_TOKEN=my_example_token
```

and use it like this:

```javascript
const settings = {
  ...
  token: process.env.REACT_APP_MINDEE_TOKEN
}
...
```

Be sure to prefix your environment variable name with `REACT_APP` to avoid problems.

Beware that exposing this token in a public repository or on a public website can be dangerous. Tokens can be revoked on [mindee platform](platform.mindee.net). If you can't guarantee your token safety, consider using a back-end proxy for mindee API requests.

## Usage with an input file

Here is an example using an HTML file input.

Let's supposed our HTML file looks like this:

```html
...
<input id="my-file-input" type="file" />
...
```

We can access files submitted via this input like this:

```javascript
const myFileInput = document.getElementById('my-file-input');

// Later, we can retrieve the file with the following code
const myFile = myFileInput.files[0]
```

In case of multiple files, you can iterate on `myFileInput.files`.

Making a call to mindee APIs can be written like this:

1 - Using `Promise` `then`/`catch`

```javascript
const resp = api.predict(myFile).then(data => console.log('Mindee result: ', data))
```

2 - Using `async`/`await`

```javascript
const resp = await api.predict(myFile)
console.log('Mindee result: ', resp)
```

## Usage with dataURI/base64

You may have a base64 string instead of a file object.
We provide a small helper to convert this kind of image to a file-like object using `Blob`.

```javascript
import { filesHelpers } from 'react-mindee-js'

const myBase64Image = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
const myFile = filesHelpers.dataURItoBlob(myBase64Image)
```

Usage is now identical to make the 'POST' request:

```javascript
api.predict(myFile)
```

## Handling errors

`MindeeAPI` won't throw any error on a failed request (status_code > 400 or 500). It will resolve normally with a message and details about your error.

It *does* throw `NetworkError` when your connection fails or if anything prevents the request from completing.

To reject the promise on error, you can add `rejectOnError` option in your `MindeeAPI` settings.

```javascript
import { MindeeAPI } from 'react-mindee-js'

const settings = {
  product: 'expense_receipts',
  version: 'v2',
  token: 'my_token_here',
  rejectOnError: true
}
const api = new MindeeAPI(settings)
```

A non successful request will throw an error that you can catch like this:

1 - Using `Promise` `then`/`catch`

```javascript
const api = new MindeeAPI(settings)
const resp = api.predict('not_a_file').catch(err => console.log(err))
```

2 - Using `async`/`await`

```javascript
const api = new MindeeAPI(settings)
try {
  await api.predict('Not a file')
} catch (err) {
  console.log(err)
}
```

You can also update requests behavior and error handling by customizing entirely how the request is made. See next section.

## Implement a custom request handler

When we instantiate our `MindeeAPI` object, we can provide a "strategy" instance:

```javascript
import { MindeeAPI, APIRequest } from 'react-mindee-js'

const settings = {
  product: 'expense_receipts',
  version: 'v2',
  token: 'my_token_here',
  strategy: new APIRequest()  // default
}
const api = new MindeeAPI(settings)
...
```

This "strategy" gives you the opportunity to customize how the request is made but also what it returns.
Let's say you implemented your hand-roll annotation viewer component, you could add a post-processing step to format data to fit your needs. Or you might add a service pre-processing files...

The default strategy object used is `APIRequest`. As a convenience and for test purposes, we provide a `FakeAPIRequest` strategy class. It logs props received and returns an empty `Promise` with a mock-up of a real server response.

Let's build an example to see how we can build such a "strategy" object.

Under the hood, requests are handled via [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) in `APIRequest`.
Let's say we would like to send our request using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) (XHR) instead of `fetch` and add a `console.log` line.

We need to provide a class implementing a `predict` method. This handler receives the following arguments:

```
url: string
headers: custom header object with your token
data: formData (with file)
method: 'POST'
rejectOnError: boolean
```

Let's implement our `XHR` handler. Let's start by adding the skeleton:

```javascript
class MyXHRService {
  async predict({ url, headers, data, method }) {
    // ACTUAL WORK SHOULD HAPPEN HERE
  }
}
```

Let's add our `console.log` and let's begin using `xhr`...

```javascript
class MyXHRService {
  async predict({ url, headers, data, method }) {
    console.log('Doing my hand-rolled xhr request...')
    let xhr = new XMLHttpRequest()

    // We should send data but return a Promise...
  }
}
```

To apply the last step, we can use `onreadystatechange` listener and `resolve`/`reject` methods from `Promise`.

```javascript
class MyXHRService {
  async predict({ url, headers, data, method }) {
    console.log('Doing my hand-rolled xhr request...')
    let xhr = new XMLHttpRequest()

    // Returning a promise
    return new Promise((resolve, reject) => {
      // Add XHR listener
      xhr.onreadystatechange = () => {
        // Discard event when incomplete
        if (xhr.readyState !== 4) return

        if (xhr.status >= 200 && xhr.status < 300) {
          // Successful
          resolve(xhr)
        } else {
          // If failed
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          })
        }
      }

      // Send request with headers and data
      xhr.open(method, url)
      Object.entries(headers).forEach(([header, value]) => xhr.setRequestHeader(header, value))
      xhr.send(data)
    })
  }
}
```

That's it! We made our custom XHR handler!
Here is how we would use it in our settings:

```javascript
import { MindeeAPI } from 'react-mindee-js'

const settings = {
  product: 'expense_receipts',
  version: 'v2',
  token: 'my_token_here',
  strategy: new MyXHRService()
}
const api = new MindeeAPI(settings)
...
```

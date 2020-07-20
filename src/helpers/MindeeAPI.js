// @flow

import { fakeResponse } from "./fakeApiResponse"

type mindeeHeaders = {
  "X-Inferuser-Token": string,
}

type PredictProps = {
  url: string,
  headers: mindeeHeaders,
  data: FormData,
  method: "POST",
  rejectOnError: boolean,
}
const productsList = []

const validateData = ({ product, token, version }) => {
  if (!product) {
    throw new TypeError("Product is missing")
  }
  if (!token) {
    throw new TypeError("Your token is missing")
  }
  if (!version) {
    throw new TypeError("Product version is missing")
  }
  if (!productsList.includes(product)) {
    throw new TypeError("This product doesn't exist")
  }
}

class RequestInterface {
  async predict(props: PredictProps): Promise<any> {
    throw new Error("predict() method needs to be defined in child class")
  }
}

export class APIRequest extends RequestInterface {
  async predict({ url, headers, data, method, rejectOnError }: PredictProps) {
    const response = await fetch(url, { method, headers, body: data })
    if (!response.ok && rejectOnError) {
      return Promise.reject(response)
    }
    return response.json()
  }
}

export class FakeAPIRequest extends RequestInterface {
  async predict(props: PredictProps) {
    return new Promise((resolve) => {
      resolve(fakeResponse)
    })
  }
}

type MindeeAPIProps = {
  product: string,
  version: string,
  token: string,
  strategy: RequestInterface,
  rejectOnError?: boolean,
}

export class MindeeAPI {
  product: string
  version: string
  token: string
  strategy: RequestInterface
  rejectOnError: boolean

  constructor({
    product,
    version,
    token,
    strategy = new APIRequest(),
    rejectOnError = false,
  }: MindeeAPIProps) {
    validateData({ product, version, token })
    this.strategy = strategy
    this.product = product
    this.token = token
    this.version = version
    this.rejectOnError = rejectOnError
  }

  getURL() {
    const mindeeAPIBaseURL = "https://api.mindee.net/products/"
    return `${mindeeAPIBaseURL}${this.product}/${this.version}/predict`
  }

  getHeaders() {
    return {
      "X-Inferuser-Token": this.token,
    }
  }

  getFormData(file: File) {
    const formData = new FormData()
    formData.append("file", file)
    return formData
  }

  async predict(file: File) {
    return this.strategy.predict({
      url: this.getURL(),
      data: this.getFormData(file),
      headers: this.getHeaders(),
      method: "POST",
      rejectOnError: this.rejectOnError,
    })
  }
}

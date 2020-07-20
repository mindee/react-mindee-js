// @flow
import { useEffect } from "react"

const useErrorsHandler = ({
  component,
  image,
}: {
  component: string,
  image: File | String,
}) => {
  useEffect(() => {
    if (!image) {
      throw new Error(`${component} : Image is missing`)
    }
  }, [image])
}

export default useErrorsHandler

import babel from "@rollup/plugin-babel"
import commonjs from "@rollup/plugin-commonjs"
import external from "rollup-plugin-peer-deps-external"
import postcss from "rollup-plugin-postcss"
import resolve from "@rollup/plugin-node-resolve"
import url from "@rollup/plugin-url"
import svgr from "@svgr/rollup"
import image from "@rollup/plugin-image"
import includePaths from "rollup-plugin-includepaths"

import pkg from "./package.json"

export default {
  input: "src/index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: true,
    },
  ],
  external: ["stream"],
  plugins: [
    external("stream"),
    postcss(),
    image(),
    url(),
    svgr(),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "runtime",
    }),
    resolve(),
    commonjs({
      namedExports: {
        "node_modules/react-is/index.js": [
          "typeOf",
          "isElement",
          "isValidElementType",
        ],
      },
    }),
    includePaths({ paths: ["./src/"] }),
  ],
}

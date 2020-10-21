import babel from "@rollup/plugin-babel";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "drupal-navigator.esm.js",
  },
  external: [
    "react",
  ],
  plugins: [
    resolve({
      extensions: [".js", ".jsx"],
    }),
    babel({
      exclude: /node_modules/,
      babelHelpers: "runtime",
    }),
  ],
};

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "response-switch.esm.js",
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
    commonjs(),
  ],
};

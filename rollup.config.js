import resolve from "@rollup/plugin-node-resolve";
import { terser } from "@rollup/plugin-terser";

export default {
  input: "dist/puffv.min.js",
  output: [
    {
      file: "dist/puffv.umd.js",
      format: "umd",
      name: "Puffv",
    },
    {
      file: "dist/puffv.esm.js",
      format: "es",
    },
    {
      file: "dist/puffv.cjs",
      format: "cjs",
    }
  ],
  plugins: [
    resolve(),
    terser()
  ]
};

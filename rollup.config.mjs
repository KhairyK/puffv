import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const banner = `
/*
  2025 © OpenDN Foundation (PHPin)
  PuffvJS — v0.0.1
  MIT LICENSE (https://kyrtproduct.license.kyrt.my.id)
  Support UMD, AMD, ESM, RequireJS
*/
`;

export default [
  {
    input: "dist/puffv.min.js",
    output: {
      file: "dist/puffv.umd.js",
      format: "umd",
      name: "Puffv",
      banner
    },
    plugins: [resolve()]
  },
  {
    input: "src/puffv.js",
    output: {
      file: "dist/puffv.umd.min.js",
      format: "umd",
      name: "Puffv",
      banner
    },
    plugins: [resolve(), terser()]
  },
  {
    input: "src/puffv.js",
    output: {
      file: "dist/puffv.esm.js",
      format: "es",
      banner
    },
    plugins: [resolve(), terser()]
  },
  {
    input: "src/puffv.js",
    output: {
      file: "dist/puffv.cjs",
      format: "cjs",
      banner
    },
    plugins: [resolve(), terser()]
  }
];

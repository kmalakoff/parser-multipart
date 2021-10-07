import externals from "rollup-plugin-node-externals";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";

import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensions = [".js", ".ts"];

export default {
  input: path.resolve(__dirname, "..", "..", "src", "index.ts"),
  output: [
    {
      file: path.resolve(__dirname, "..", "..", "dist", "cjs", "index.js"),
      format: "cjs",
      sourcemap: true,
      exports: "auto",
    },
  ],
  plugins: [
    externals({ deps: true }),
    resolve({ extensions }),
    commonjs(),
    babel({ babelHelpers: "bundled", include: ["src/**/*.ts"], extensions, exclude: "./node_modules/**" }),
  ],
};

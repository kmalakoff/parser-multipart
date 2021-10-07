import externals from "rollup-plugin-node-externals";
import resolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";

import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensions = [".js", ".ts"];

export default {
  input: path.resolve(__dirname, "..", "..", "src", "index.ts"),
  output: [
    {
      file: path.resolve(__dirname, "..", "..", "dist", "esm", "index.js"),
      format: "esm",
      sourcemap: true,
    },
  ],
  plugins: [
    externals({ deps: true }),
    resolve({ extensions }),
    babel({ babelHelpers: "bundled", include: ["src/**/*.ts"], extensions, exclude: "./node_modules/**" }),
  ],
};

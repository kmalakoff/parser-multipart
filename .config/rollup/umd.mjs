import externals from "rollup-plugin-node-externals";
import resolve from "@rollup/plugin-node-resolve";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import camelcase from "camelcase";

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "package.json"), "utf8"));
const extensions = [".js", ".ts"];

export default {
  input: path.resolve(__dirname, "..", "..", "src", "index.ts"),
  output: [
    {
      file: path.resolve(__dirname, "..", "..", "dist", "umd", `${pkg.name}.js`),
      format: "umd",
      sourcemap: true,
      name: camelcase(pkg.name),
    },
    {
      file: path.resolve(__dirname, "..", "..", "dist", "umd", `${pkg.name}.min.js`),
      format: "umd",
      sourcemap: true,
      name: camelcase(pkg.name),
      plugins: [terser()],
    },
  ],
  plugins: [
    externals({ deps: true }),
    resolve({ extensions }),
    babel({ babelHelpers: "bundled", include: ["src/**/*.ts"], extensions, exclude: "./node_modules/**" }),
  ],
};

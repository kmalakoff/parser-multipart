import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "..", "dist");

fs.writeFileSync(path.join(distPath, "cjs", "package.json"), JSON.stringify({ type: "commonjs" }));
fs.writeFileSync(path.join(distPath, "esm", "package.json"), JSON.stringify({ type: "module" }));
fs.writeFileSync(path.join(distPath, "umd", "package.json"), JSON.stringify({ type: "commonjs" }));

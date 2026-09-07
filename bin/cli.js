#!/usr/bin/env node
import { createServer } from "vite";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const server = await createServer({ root });
await server.listen();

const url = server.resolvedUrls.local[0];
console.log("▶ Video Preview running at " + url);

const opener =
    process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";

exec(`${opener} ${url}`);

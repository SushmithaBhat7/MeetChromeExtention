// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

import { defineConfig } from "vite";
import jsconfigPaths from "vite-jsconfig-paths";

import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";

import manifest from "./manifest.json";

// const manifest = manifestJson as ManifestV3Export;

export default defineConfig({
  plugins: [jsconfigPaths(), react(), crx({ manifest })],
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/AmazonProductListingWithAI/", // <-- important for GitHub Pages
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:9003", // backend server URL (works only locally)
    },
  },
});

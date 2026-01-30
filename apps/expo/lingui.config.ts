import { defineConfig } from "@lingui/conf";

export default defineConfig({
  sourceLocale: "en",
  locales: ["en", "es", "fr"],
  catalogs: [
    {
      path: "<rootDir>/locales/{locale}/messages",
      include: ["app", "lib"],
    },
  ],
  format: "po",
});

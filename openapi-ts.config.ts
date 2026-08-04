import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "https://job-tracker-api-g0bn.onrender.com/api-json",
  output: "src/api/generated",
  plugins: ["@hey-api/client-axios"],
});

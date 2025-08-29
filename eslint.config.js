import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  { ignores: ["dist"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.app.json",
        },
      },
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            [
              "./SetPublicPath",
              // Side effect imports
              "^\\u0000",
              // `react`-> `@testing-library` -> other packages in alphabetical order
              "^react",
              "^@testing-library",
              // Internal packages (starting with @/)
              "^@/",
              // Other external packages
              "^@",
              "^[a-z]",
              // Imports starting with `../`
              "^\\.\\.(?!/?$)",
              "^\\.\\./?$",
              // Imports starting with `./`
              "^\\./(?=.*/)(?!/?$)",
              "^\\.(?!/?$)",
              "^\\./?$",
            ],
          ],
        },
      ],
    },
  },
]);

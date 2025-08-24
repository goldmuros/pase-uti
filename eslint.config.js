import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "simple-import-sort/imports": [
      "error",
      {
        "groups": [
          [
            "./SetPublicPath",
            // Side effect imports
            "^\\u0000",
            // `react`-> `@sage`packages ->`carbon-react`->`RTL`, then other packages in alphabetical order
            "^react",
            "^@testing-library",
            "^@",
            "^[a-z]",
            // Imports starting with `../`
            "^\\.\\.(?!/?$)",
            "^\\.\\./?$",
            // Imports starting with `./`
            "^\\./(?=.*/)(?!/?$)",
            "^\\.(?!/?$)",
            "^\\./?$"
          ]
        ]
      }
    ],
}
    }
  },
])

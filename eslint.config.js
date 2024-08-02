import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import lodash from "eslint-plugin-lodash";
import unusedImports from "eslint-plugin-unused-imports";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    "eslint:recommended",
    "plugin:lodash/recommended"
    // "plugin:react-hooks/recommended"
  ),
  {
    plugins: {
      "unused-imports": unusedImports,
      "@typescript-eslint": typescriptEslint,
      lodash,
    },

    languageOptions: {
      parser: tsParser,
    },

    settings: {
      react: {
        version: "detect",
      },
    },

    rules: {
      "no-unused-vars": "off",
      "lodash/prefer-lodash-method": "off",
      "lodash/prefer-constant": "off",
      "lodash/prefer-lodash-typecheck": "off",
      "lodash/prefer-immutable-method": "off",
      "lodash/matches-prop-shorthand": [2, "never"],
      "unused-imports/no-unused-imports": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],

      "no-restricted-imports": ["error"],
    },
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],

    rules: {
      "no-undef": "off",
    },
  },
];

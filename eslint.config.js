// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const importPlugin = require("eslint-plugin-import")

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    plugins: {
      import: importPlugin
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      // Règles strictes pour un code propre
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "no-console": ["warn", { "allow": ["warn", "error"] }],
      "semi": ["error", "always"],
      "no-trailing-spaces": "error",
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": ["error", "always"],
      "import/order": ["error", {
        groups: [
          'builtin',       // Node modules
          'external',      // npm packages
          'internal',      // alias like @/...
          ['parent', 'sibling', 'index'], // relative imports
        ],
        alphabetize: { order: 'asc', caseInsensitive: true },
      }],
      "import/no-unresolved": "error",
    },
    "settings": {
      "import/resolver": {
        "typescript": {
          "project": "./tsconfig.json"
        }
      }
    }
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);

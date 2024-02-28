// const { resolve } = require("node:path");
//
// const project = resolve(process.cwd(), "tsconfig.json");
//
// /*
//  * This is a custom ESLint configuration for use with
//  * Next.js apps.
//  *
//  * This config extends the Vercel Engineering Style Guide.
//  * For more information, see https://github.com/vercel/style-guide
//  *
//  */
//
// module.exports = {
//   extends: [
//     "@vercel/style-guide/eslint/node",
//     "@vercel/style-guide/eslint/browser",
//     "@vercel/style-guide/eslint/typescript",
//     "@vercel/style-guide/eslint/react",
//     "@vercel/style-guide/eslint/next",
//     "eslint-config-turbo",
//   ].map(require.resolve),
//   parserOptions: {
//     project,
//   },
//   globals: {
//     React: true,
//     JSX: true,
//   },
//   settings: {
//     "import/resolver": {
//       typescript: {
//         project,
//       },
//     },
//   },
//   ignorePatterns: ["node_modules/", "dist/"],
//   // add rules configurations here
//   rules: {
//     "import/no-default-export": "off",
//   },
// };

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  extends: [
    // "next/core-web-vitals",
    // "eslint:recommended",
    // "plugin:react/recommended",
    // "plugin:@typescript-eslint/recommended",
    // "plugin:prettier/recommended",
    // "plugin:tailwindcss/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

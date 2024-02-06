module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },

  env: {
    browser: true,
    node: true,
    es6: true,
  },

  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      node: {
        extensions: [".ts", ".tsx"],
      },
    },
  },

  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "airbnb",
    "prettier",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
    "plugin:sonarjs/recommended",
    "plugin:security/recommended",
  ],

  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "react/jsx-filename-extension": [
      1,
      {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
      },
    ],
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "jsx-a11y/anchor-is-valid": [
      "error",
      {
        components: ["Link"],
        specialLink: ["hrefLeft", "hrefRight"],
        aspects: ["invalidHref", "preferButton"],
      },
    ],
    "no-nested-ternary": "off",
    "import/prefer-default-export": "off",
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          "@mui/*/*/*",
          "!@mui/material/test-utils/*",
          "!node_modules",
        ],
      },
    ],
    "no-unused-vars": "error",
    "no-console": "error",
    "no-warning-comments": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        vars: "all",
        args: "none",
      },
    ],
    "no-param-reassign": "off",
    "react/prop-types": "off",
    "react/require-default-props": "off",
    "react/react-in-jsx-scope": "off",
    "react/jsx-props-no-spreading": "off",
    "no-shadow": "off",
    "react-hooks/exhaustive-deps": "off",
    "import/no-cycle": "off",
    "prefer-destructuring": "off",
    "import/no-extraneous-dependencies": "off",
    "react/display-name": "off",
    "import/no-unresolved": ["off", { caseSensitive: false }],
  },
  overrides: [
    {
      files: ["node_modules/eslint/lib/cli-engine/formatters/stylish.js"],
      parserOptions: {
        sourceType: "script", // or 'module' based on the context of the file
      },
    },
  ],
};

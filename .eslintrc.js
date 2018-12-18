module.exports = {
  parser: "babel-eslint",
  env: {
    browser: true,
    jest: true,
    mocha: true
  },
  globals: {
    artifacts: true,
    contract: true,
    assert: true,
    web3: true
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: ["react"],
  rules: {
    "no-use-before-define": "off",
    "react/prop-types": "off",
    "react/jsx-filename-extension": ["error", { extensions: [".js", ".jsx"] }],
    "react/prefer-stateless-function": "off"
  }
};

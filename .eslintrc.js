module.exports = {
  extends: 'airbnb-base',
  env: {
    node: true,
    mocha: true,
  },
  globals: {
    web3: true,
    artifacts: true,
    contract: true,
  },
  plugins: [
    'mocha',
    "chai-friendly",
  ],
  rules: {
    'prefer-spread': 0,
    'mocha/no-exclusive-tests': 'error',
    'no-unused-expressions': 0,
    'chai-friendly/no-unused-expressions': 2,
  },
};

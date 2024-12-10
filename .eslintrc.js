const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaFeatures: {
      // Supports decorators
      legacyDecorators: true
    }
  },
  // ESlint rules：https://eslint.org/docs/rules/
  // Vue rules：https://eslint.vuejs.org/rules/
  rules: {
    // 'no-console': 'off',
    'no-debugger': isProd ? 'warn' : 'off',
    'no-unused-vars': 'warn',
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-prototype-builtins': 'off',
    'vue/no-v-html': 'off',
    'vue/no-unused-vars': 'warn',
    'vue/require-default-prop': 'off',
    'vue/no-mutating-props': 'off',
    // Vue single file block blank line
    'vue/padding-line-between-blocks': 2,
    // Multi-line attributes add empty lines
    'vue/new-line-between-multi-line-property': [
      'error',
      {
        minLineOfMultilineProperty: 2
      }
    ]
  }
}

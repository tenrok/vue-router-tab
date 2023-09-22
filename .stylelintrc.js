/**
 * stylelint configuration
 * stylelint: https://stylelint.io/user-guide/rules/list
 * stylelint-scss: https://github.com/kristerkari/stylelint-scss
 * stylelint-config-rational-order: https://github.com/constverum/stylelint-config-rational-order
 */

module.exports = {
  extends: ['stylelint-config-recommended', 'stylelint-config-rational-order', 'stylelint-config-prettier'],
  plugins: ['stylelint-scss', 'stylelint-order', 'stylelint-config-rational-order/plugin'],
  rules: {
    // Pseudo element
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ],

    // Common font
    'font-family-no-missing-generic-family-keyword': [
      true,
      {
        ignoreFontFamilies: ['rt-icon', 'element-icons']
      }
    ],

    'no-descending-specificity': null,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true
  }
}

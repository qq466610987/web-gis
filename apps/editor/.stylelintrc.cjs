module.exports = {
  root: true,
  defaultServerity: 'error',
  extends: [
      'stylelint-config-standard',
      // 'stylelint-config-recess-order',
      'stylelint-config-prettier'
  ],
  plugins: [
      'stylelint-order',
      'stylelint-scss'
  ],
  overrides: [
    {
        files: [`**/*.{vue,html}`],
        customSyntax: 'postcss-html',
    },
  ],
  rules: {
      indentation: 2,
      "max-empty-lines": 1,
      "no-eol-whitespace": true,
      "declaration-block-no-duplicate-properties": true,
      'declaration-colon-space-before': 'never',
      'declaration-colon-space-after': 'always-single-line',
      'at-rule-no-unknown': [true, {
          ignoreAtRules: ['function', 'if', 'each', 'include', 'mixin', 'return', 'for', 'use'],
      }],
      "no-empty-source": null,
      'rule-empty-line-before': ['always', { except: ['after-single-line-comment'] }],
      'selector-pseudo-class-no-unknown': [
        true,
        {
          'ignorePseudoClasses': [
            'deep',
            'global'
          ]
        }
      ],
    "no-descending-specificity": null,
    "no-invalid-double-slash-comments": null,
    "selector-class-pattern": null,
    "value-no-vendor-prefix": [
      true,
      {
        ignoreValues: ['box']
      }
    ],
    "block-opening-brace-space-before": "always-multi-line",
    "declaration-block-semicolon-newline-after": "always",
    "block-opening-brace-newline-after": "always",
    "block-closing-brace-newline-before": "always"
  },
  customSyntax: 'postcss-scss',
}
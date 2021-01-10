module.exports = {
    root: true,
    env: {
        node: true
    },
    // 使用插件的编码校验规则
    extends: [
        'plugin:vue/essential',
        '@vue/standard',
        '@vue/typescript/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2020
    },

    // 自定义编码校验规则
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        // 'semi': ['error', 'always']
        '@typescript-eslint/member-delimiter-style': ['error', {
            "multiline": {
                "delimiter": "none",
                "requireLast": true
            }
        }],
        "indent": [2, 4, { SwitchCase: 1 }],
        "comma-dangle": [2, "never"],
        "@typescript-eslint/no-explicit-any": ["off"],
        "eol-last": "off"
    }
}

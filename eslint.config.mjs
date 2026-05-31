/** @type {import('eslint').Linter.Config[]} */
import js from '@eslint/js'
import globals from 'globals'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default [
    js.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs}'],
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            eqeqeq: ['error', 'always'],
        },
    },
    {
        ignores: ['node_modules/', 'dist/', '*.config.js', '.vscode/', '.git/'],
    },
    eslintPluginPrettierRecommended,
    {
        rules: {
            'prettier/prettier': [
                'error',
                {
                    tabWidth: 4,
                    semi: false,
                    singleQuote: true,
                },
            ],
        },
    },
]

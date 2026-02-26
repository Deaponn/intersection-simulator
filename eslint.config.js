import { defineConfig } from 'eslint/config';

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import tseslint from 'typescript-eslint';
import vitest from '@vitest/eslint-plugin';

export default defineConfig(
    {
        ignores: ['**/*.js'],
    },
    eslint.configs.recommended,
    tseslint.configs.strictTypeChecked,
    tseslint.configs.stylisticTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                projectService: true,
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'error',
        },
    },
    eslintConfigPrettier,
    {
        files: ['**/*.test.ts', '**/*.spec.ts'],
        plugins: {
            vitest,
        },
        rules: {
            ...vitest.configs.recommended.rules,
            '@typescript-eslint/unbound-method': 'off',
        },
    },
);

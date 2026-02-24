import { defineConfig } from 'eslint/config';

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import perfectionist from 'eslint-plugin-perfectionist';
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
    },
    perfectionist.configs['recommended-natural'],
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
    {
        rules: {
            'perfectionist/sort-classes': 'off'
        }
    }
);

/** @type { import("eslint").Linter.Config } */
module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
	],
	globals: {
		T: true,
		K: true,
	},
	parser: '@typescript-eslint/parser',
	plugins: ['@typescript-eslint', 'simple-import-sort'],
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020,
		extraFileExtensions: ['.svelte'],
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
	},
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: '@typescript-eslint/parser',
			},
		},
	],
	rules: {
		'no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
		indent: ['error', 'tab'],
		quotes: ['error', 'single', { avoidEscape: true }],
		'quote-props': ['error', 'as-needed'],
		'comma-dangle': ['error', 'always-multiline'],
		'simple-import-sort/imports': 'error',
		'simple-import-sort/exports': 'error',
	},
};

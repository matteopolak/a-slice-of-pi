module.exports = {
	apps: [
		{
			name: 'a-slice-of-pi',
			script: './build/index.js',
			env: {
				NODE_ENV: 'production',
				PORT: '5060',
			},
		},
	],
}

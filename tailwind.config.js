// tailwind.config.js
const fluid = require('fluid-tailwind');
const { extract, screens, fontSize } = require('fluid-tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: {
		files: ['./src/**/*.{html,js,svelte,ts,jsx,tsx,mdx}'],
		extract
	},
	darkMode: ['class', '[data-mode="dark"]'],
	theme: {
		screens,
		fontSize,
		extend: {
			screens: {
				xsm: '8rem',
				xs: '20rem'
			},
			fontFamily: {
				sans: ['Inter Variable', 'sans-serif']
			}
		}
	},
	plugins: [fluid]
};

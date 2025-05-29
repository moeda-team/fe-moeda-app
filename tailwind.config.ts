import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        primary: {
          50: '#e6f4f3',
          100: '#cce8e6',
          200: '#99d1cd',
          300: '#66b9b3',
          400: '#339299',
          500: '#2A625A', // base color
          600: '#225049',
          700: '#1a3e39',
          800: '#122d29',
          900: '#0b1b19',
        },
        neutral: {
          50: '#f3f4f5',
          100: '#e6e7e9',
          200: '#cfd2d6',
          300: '#b8bcc3',
          400: '#929aa2',
          500: '#11181C', // base neutral
          600: '#0e1316',
          700: '#0b0e10',
          800: '#080a0c',
          900: '#050506',
        },
        info: {
          50: '#e6f4fe',
          100: '#cce9fd',
          200: '#99d4fb',
          300: '#66bef9',
          400: '#33a9f7',
          500: '#1f90dd',
          600: '#1770ad',
          700: '#10507d',
          800: '#08304d',
          900: '#02101d',
        },
        danger: {
          50: '#fdeaea',
          100: '#fbd5d5',
          200: '#f6aaaa',
          300: '#f28080',
          400: '#ee5555',
          500: '#e02f2f',
          600: '#b32626',
          700: '#861c1c',
          800: '#591212',
          900: '#2c0909',
        },
        warning: {
          50: '#fff9e6',
          100: '#fff2cc',
          200: '#ffe599',
          300: '#ffd966',
          400: '#ffcc33',
          500: '#ffbb00',
          600: '#cc9600',
          700: '#997000',
          800: '#664b00',
          900: '#332500',
        },
        success: {
          50: '#e9f8f0',
          100: '#d3f1e1',
          200: '#a7e3c2',
          300: '#7bd5a4',
          400: '#4fc785',
          500: '#28b267',
          600: '#209052',
          700: '#186e3e',
          800: '#104c2a',
          900: '#082a15',
        },
      },
    },
  },
  plugins: [],
}
export default config

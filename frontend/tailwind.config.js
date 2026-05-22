/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f6f5f0',
        bg2: '#ffffff',
        bg3: '#eeede6',
        text: '#1a1a14',
        text2: '#4a4a40',
        text3: '#9a9a8a',
        green: '#1d6a40',
        green2: '#25a058',
        'green-light': '#e8f5ee',
        'green-border': '#b8ddc8',
        border: '#e2e1d8',
        border2: '#c8c7bc',
      },
      fontFamily: {
        sans: ['Bricolage Grotesque', 'sans-serif'],
        serif: ['Lora', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

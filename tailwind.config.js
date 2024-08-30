/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#111',
        'dark-surface': '#1A1A1A',
        'dark-input': '#222',
      },
    },
  },
  plugins: [],
}


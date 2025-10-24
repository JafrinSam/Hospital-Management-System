/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',               // Vite entry point
    './src/**/*.{js,ts,jsx,tsx}', // All React source files
  ],
  theme: {
    extend: {
      colors: {
        cyan: '#0088A3', 
        secondry_colour:'#0A4174'         // Your custom cyan color
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hcss: {
          blue: '#0A2540',
          orange: '#FF6200',
        }
      }
    },
  },
  plugins: [],
}

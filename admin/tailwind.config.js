/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        admin: {
          primary: "#4f46e5",
          secondary: "#1e1b4b",
          accent: "#06b6d4",
          background: "#0f172a",
          card: "#1e293b",
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ec4899',       // Neon Pink
        secondary: '#06b6d4',     // Neon Cyan
        accent: '#fbbf24',        // Neon Yellow
        neonPurple: '#a855f7',    // Neon Purple
        neonGreen: '#10b981',     // Neon Green
      },
    },
  },
  plugins: [],
}

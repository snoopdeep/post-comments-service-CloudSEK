/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navbar-color': '#64748b',//'#94a3b8', // Add your custom color
      },
    },
  },
  plugins: [
    // Safely renders HTML content using dangerouslySetInnerHTML
    require('@tailwindcss/typography'),
  ],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        light: {
          bg: "#ffffff",
          text: "#1f2937",
          border: "#e5e7eb",
          secondary: "#f3f4f6",
        },

        dark: {
          bg: "#1f2937",
          text: "#f3f4f6",
          border: "#374151",
          secondary: "#111827",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

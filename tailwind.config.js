/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#004d99",
        "primary-container": "#1565c0",
        surface: "#fcf9f8",
        "surface-container-low": "#f6f3f2",
        "surface-container-highest": "#e5e2e1",
        "surface-container-lowest": "#ffffff",
        tertiary: "#425059",
        background: "#fcf9f8",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        outline: "#727783",
        "outline-variant": "#c4c7c5",
        "on-surface": "#1b1c1c",
        "on-surface-variant": "#49454f",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        ambient: "0px 12px 32px -4px rgba(27, 28, 28, 0.05)",
      }
    },
  },
  plugins: [],
}

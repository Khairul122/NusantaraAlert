/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#006c49",
        "primary-container": "#10b981",
        "primary-fixed": "#6ffbbe",
        "primary-fixed-dim": "#4edea3",
        "on-primary": "#ffffff",
        "on-primary-container": "#00422b",
        "safety-emerald": "#10B981",
        
        "secondary": "#006591",
        "secondary-container": "#39b8fd",
        "secondary-fixed": "#c9e6ff",
        "weather-sky": "#0EA5E9",
        
        "tertiary": "#bc0b3b",
        "tertiary-container": "#ff7886",
        "alert-rose": "#F43F5E",
        
        "warning-amber": "#F59E0B",
        
        "background": "#f7f9fb",
        "on-background": "#191c1e",
        "surface": "#f7f9fb",
        "surface-dim": "#d8dadc",
        "surface-bright": "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-border": "#E2E8F0",
        "on-surface": "#191c1e",
        "on-surface-variant": "#3c4a42",
        
        "text-main": "#0F172A",
        "text-muted": "#64748B",
        "outline": "#6c7a71",
        "outline-variant": "#bbcabf"
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif']
      },
      borderRadius: {
        '2xl': '1.5rem',
      },
      spacing: {
        'gutter': '20px',
        'container-margin': '24px'
      }
    },
  },
  plugins: [],
}

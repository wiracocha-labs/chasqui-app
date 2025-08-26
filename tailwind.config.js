/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./frontend/index.html",
    "./frontend/src/**/*.{js,ts,jsx,tsx,vue}",
    "./frontend/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        // Heredamos de CSS variables - Sin duplicación
        'dark': {
          DEFAULT: 'var(--color-bg-primary)', 
          light: 'var(--color-text-primary)',   
        },
        'light': {
          DEFAULT: 'var(--color-bg-secondary)', 
          dark: 'var(--color-text-secondary)',   
        },
        brand: {
          DEFAULT: 'var(--color-brand)',
          10: 'var(--color-brand-10)',
          20: 'var(--color-brand-20)',
        },
        action: {
          DEFAULT: 'var(--color-action)',
          10: 'var(--color-action-10)',
          20: 'var(--color-action-20)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          10: 'var(--color-accent-10)',
          20: 'var(--color-accent-20)',
        },
        
        // Solo colores adicionales que no están en CSS variables
        green: '#48bb78',
        
        // Clases específicas del diseño Slack para compatibilidad con el HTML original
        indigo: {
          'darkest': '#1e1e3f',
          'darker': '#2a2a5a', 
          'lighter': '#6b7cb8',
        },
        purple: {
          'lighter': '#e2d6ff',
        },
        teal: {
          'dark': '#285e61',
        },
        grey: {
          DEFAULT: '#9ca3af',
          'darkest': '#1f2937',
          'dark': '#374151',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      // Utilities específicas del HTML original
      spacing: {
        'pin-y': '0',
        'pin-l': '0',
      },
    },
    // Agregar utilities personalizadas para compatibilidad
    extend: {},
  },
  // Plugin para agregar las clases específicas del HTML original
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.pin-y': {
          top: '0',
          bottom: '0',
        },
        '.pin-l': {
          left: '0',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}

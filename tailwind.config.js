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
        // Colores personalizados del proyecto Chasqui
        bg: {
          primary: '#2E1E1A',   // --color-bg-primary
          secondary: '#5C5C5C', // --color-bg-secondary
        },
        text: {
          primary: '#F5F5F5',   // --color-text-primary
          secondary: '#D9D9D9', // --color-text-secondary
        },
        brand: '#D4AF37',       // --color-brand (oro)
        action: '#A9442B',      // --color-action (rojo oscuro)
        accent: '#F27D42',      // --color-accent (naranja)
        
        // Mantener algunos colores por defecto útiles
        primary: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#D4AF37', // brand color
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundColor: {
        'chasqui-primary': '#2E1E1A',
        'chasqui-secondary': '#5C5C5C',
      },
      textColor: {
        'chasqui-primary': '#F5F5F5',
        'chasqui-secondary': '#D9D9D9',
        'chasqui-brand': '#D4AF37',
        'chasqui-action': '#A9442B',
        'chasqui-accent': '#F27D42',
      },
    },
  },
  plugins: [],
}

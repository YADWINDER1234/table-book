import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FDFBF7',
        surface: '#FFFFFF',
        'surface-bright': '#F8F5F0',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low': '#FDFBF7',
        'surface-container': '#F8F5F0',
        'surface-container-high': '#F3EFE6',
        'surface-container-highest': '#EAE4D9',
        primary: '#C9A96E',
        'on-primary': '#FFFFFF',
        'primary-container': '#F5EEDC',
        secondary: '#9B7676',
        'on-secondary': '#FFFFFF',
        'secondary-container': '#F0E4E4',
        'on-secondary-container': '#3a2020',
        tertiary: '#647A58',
        error: '#BA1A1A',
        'on-error': '#FFFFFF',
        'outline-variant': '#D9D3C7',
        'on-surface': '#1C1B18',
        'on-surface-variant': '#4E4C45',
        dark: '#0c0b0a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif', 'serif'],
      },
      boxShadow: {
        'luxury-ambient': '0 8px 32px rgba(0, 0, 0, 0.04), 0 2px 12px rgba(201, 169, 110, 0.1)',
        'nav-glow': '0 1px 0 rgba(201, 169, 110, 0.15)',
      },
    },
  },
  plugins: [forms],
};

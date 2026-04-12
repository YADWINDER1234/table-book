import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0c0b0a',
        surface: '#141311',
        'surface-bright': '#1e1d1a',
        'surface-container-lowest': '#080807',
        'surface-container-low': '#18170f',
        'surface-container': '#1f1e18',
        'surface-container-high': '#2a2820',
        'surface-container-highest': '#353228',
        primary: '#C9A96E',
        'on-primary': '#1a1408',
        'primary-container': '#3a2e14',
        secondary: '#B88B8B',
        'on-secondary': '#1a0e0e',
        'secondary-container': '#3a2020',
        'on-secondary-container': '#f0d4d4',
        tertiary: '#7A8F6D',
        error: '#D4574E',
        'on-error': '#ffffff',
        'outline-variant': '#3d3a33',
        'on-surface': '#f0ece4',
        'on-surface-variant': '#9e998e',
        dark: '#0c0b0a',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif', 'serif'],
      },
      boxShadow: {
        'luxury-ambient': '0 8px 32px rgba(0, 0, 0, 0.5), 0 2px 12px rgba(201, 169, 110, 0.06)',
        'nav-glow': '0 1px 0 rgba(201, 169, 110, 0.08)',
      },
    },
  },
  plugins: [forms],
};

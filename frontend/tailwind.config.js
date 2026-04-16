import forms from '@tailwindcss/forms';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-bright': 'var(--color-surface-bright)',
        'surface-container-lowest': 'var(--color-surface-container-lowest)',
        'surface-container-low': 'var(--color-surface-container-low)',
        'surface-container': 'var(--color-surface-container)',
        'surface-container-high': 'var(--color-surface-container-high)',
        'surface-container-highest': 'var(--color-surface-container-highest)',
        primary: 'var(--color-primary)',
        'on-primary': 'var(--color-on-primary)',
        'primary-container': 'var(--color-primary-container)',
        secondary: 'var(--color-secondary)',
        'on-secondary': 'var(--color-on-secondary)',
        'secondary-container': 'var(--color-secondary-container)',
        'on-secondary-container': 'var(--color-on-secondary-container)',
        tertiary: 'var(--color-tertiary)',
        error: 'var(--color-error)',
        'on-error': 'var(--color-on-error)',
        'outline-variant': 'var(--color-outline-variant)',
        'on-surface': 'var(--color-on-surface)',
        'on-surface-variant': 'var(--color-on-surface-variant)',
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

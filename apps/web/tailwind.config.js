/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        focus: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        myduc: {
          gold: '#fbbf24',
          emerald: '#10b981',
          cyan: '#06b6d4',
          crimson: '#f43f5e',
          ruby: '#e11d48',
          purple: '#8b5cf6',
        },
      },
      boxShadow: {
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.4)',
        'glow-ruby': '0 0 35px -5px rgba(225, 29, 72, 0.45)',
        'glow-gold': '0 0 35px -5px rgba(251, 191, 36, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          'from': { backgroundPosition: '0 0' },
          'to': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};

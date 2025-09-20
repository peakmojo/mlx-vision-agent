/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // macOS Big Sur inspired colors
        'macos-bg': '#1c1c1e',
        'macos-surface': '#2c2c2e',
        'macos-card': '#3a3a3c',
        'macos-border': '#48484a',
        'macos-text': '#f2f2f7',
        'macos-text-secondary': '#aeaeb2',
        'macos-blue': '#007aff',
        'macos-green': '#34c759',
        'macos-red': '#ff3b30',
        'macos-orange': '#ff9500',
        'macos-yellow': '#ffcc02',
        'macos-purple': '#af52de',
        // YC-style accents
        'yc-orange': '#ff6600',
        'yc-orange-light': '#ff8533',
        'yc-orange-dark': '#cc5200',
      },
      fontFamily: {
        'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'sf-mono': ['SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'monospace'],
      },
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-macos': 'pulseMacos 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseMacos: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 },
        },
        bounceSubtle: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        'macos': '20px',
        'macos-heavy': '40px',
      },
      borderRadius: {
        'macos': '12px',
        'macos-lg': '16px',
        'macos-xl': '20px',
      },
      boxShadow: {
        'macos': '0 10px 40px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(0, 0, 0, 0.1)',
        'macos-lg': '0 20px 60px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.15)',
        'macos-inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
        'macos-button': '0 2px 8px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
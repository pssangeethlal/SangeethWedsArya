/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FBF7F2',
        blush: '#E8C5C0',
        'rose-deep': '#B07A75',
        sage: '#A8B5A0',
        gold: '#C9A96E',
        'gold-light': '#E5D4A8',
        ink: '#3A2F2A',
        'ink-soft': '#6B5D54',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        script: ['"Pinyon Script"', 'cursive'],
        body: ['Inter', 'sans-serif'],
      },
      keyframes: {
        kenburns: {
          '0%': { transform: 'scale(1) translateY(0px)' },
          '100%': { transform: 'scale(1.08) translateY(-15px)' },
        },
        floatUp: {
          '0%': { opacity: '0', transform: 'translateY(0px)' },
          '20%': { opacity: '0.7' },
          '100%': { opacity: '0', transform: 'translateY(-100vh)' },
        },
      },
      animation: {
        kenburns: 'kenburns 12s ease-in-out infinite alternate',
        'float-up': 'floatUp linear infinite',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF3E7',
        ivory: '#FBF7F2',
        blush: '#E8C5C0',
        marigold: '#E0A33D',
        'marigold-light': '#F2C76A',
        maroon: '#6E1F2B',
        'maroon-soft': '#8E3140',
        'rose-deep': '#B07A75',
        sage: '#A8B5A0',
        gold: '#C9A24B',
        'gold-light': '#E8D29A',
        'gold-deep': '#A8842F',
        ink: '#2A1E1A',
        'ink-soft': '#6B5044',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        script: ['"Pinyon Script"', 'cursive'],
        heading: ['Marcellus', 'serif'],
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
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        kenburns: 'kenburns 12s ease-in-out infinite alternate',
        'float-up': 'floatUp linear infinite',
        shimmer: 'shimmer 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

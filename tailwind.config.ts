// tailwind.config.js
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        midnightBlue: '#001f3d',
        navyBlue: '#045174',
        desertSun: '#d89c60',
        burntOrange: '#e87a00',
        paleYellow: '#FFE1AF',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'float': 'float 12s ease-in-out infinite',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'float': {
          '0%': {
            transform: 'translateY(0) rotate(0deg) translateX(0)',
            opacity: '0.2',
          },
          '33%': {
            transform: 'translateY(-15px) rotate(5deg) translateX(10px)',
            opacity: '0.3',
          },
          '66%': {
            transform: 'translateY(-25px) rotate(-5deg) translateX(-10px)',
            opacity: '0.25',
          },
          '100%': {
            transform: 'translateY(0) rotate(0deg) translateX(0)',
            opacity: '0.2',
          },
        },
      },
    },
  },
  plugins: [],
};
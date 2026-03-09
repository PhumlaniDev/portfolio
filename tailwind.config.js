export default {
  darkMode: 'class', // Enables class-based dark mode
  content: ['./src/**/*.{html,ts,css}'],
  theme: {
    extend: {},
  },
  plugins: [],
  variants: {
    extend: {
      dark: ['.dark', '.dark *'],
    },
  },
};

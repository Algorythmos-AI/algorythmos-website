export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        algviolet: '#6D00FF',
        algpurple: '#7658E7',
        algblue: '#3715E0',
      },
      boxShadow: {
        brand: '0 10px 40px -10px rgba(55,21,224,0.55)',
      }
    },
  },
  plugins: [],
};

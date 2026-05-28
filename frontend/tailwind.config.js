/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17202a',
        saffron: '#f59e0b',
        cosmic: '#4f46e5',
        lotus: '#db2777',
      },
      boxShadow: {
        soft: '0 18px 60px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [],
}

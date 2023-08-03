/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens:{
      lg: '700px',
      sm: '200px'
    },
    extend:{
      spacing:{
        '32rem': '41rem'
      },
      colors:{
        'main': '#121212',
        'secondary':'#1e1e1e',
        'dim-white' : '#c4c4c4',
        'dimest' : '#444444',
        'white': '#ffffff'
      }
    }
  },
  plugins: [],
}


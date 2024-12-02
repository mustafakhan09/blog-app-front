/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "*.html", "*.js"],
  theme: {
    extend: {
      screens: {
        '2xs': '320px',        // Extra small screens
        'xs': '480px',         // Small phones
      },
     
      width: {
        "nav-width": "16.7vw",

      },
     
      boxShadow: {
        'custom': '2px 0 5px rgba(0, 0, 0, 0.1)',
      },
      transitionTimingFunction: {
        'ease-custom': 'ease',
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
}



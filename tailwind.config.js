/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}", // <--- Эта строка говорит Tailwind смотреть внутрь .vue файлов
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

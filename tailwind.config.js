module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Add TypeScript and JSX/TSX files
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", "sans-serif"], // Use Raleway as the default sans-serif font
        colors: {
          customGray: "#f2f3f4",
        },
      },
    },
  },
  plugins: [],
};

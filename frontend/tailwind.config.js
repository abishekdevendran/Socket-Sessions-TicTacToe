module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "brand-primary": "var(--brand-primary)",
        "brand-secondary": "var(--brand-secondary)",
        "brand-tertiary": "var(--brand-tertiary)",
        "brand-grey-primary": "var(--brand-grey-primary)",
        "brand-grey-secondary": "var(--brand-grey-secondary)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      animation: {
        "spin-slow": "spin 25s linear infinite",
        "scroll-text": "scroll-text 7s linear infinite",
        "round-timer": "round-timer 10s linear infinite",
      },
      keyframes: {
        "scroll-text": {
          "0%,95%,100%": { transform: "translateX(0%)" },
          "90%": { transform: "translateX(-50%)" },
        },
        "round-timer": {
          "100%": {
            transform: "scaleY(0)",
          },
          "0%": {
            transform: "scaleY(1)",
          },
        },
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#18534F",
          50: "#E6F0EF",
          100: "#CCE0DF",
          200: "#99C1BF",
          300: "#66A29F",
          400: "#33837F",
          500: "#18534F",
          600: "#134240",
          700: "#0E3230",
          800: "#0A2120",
          900: "#051110",
        },
        secondary: {
          DEFAULT: "#226D68",
          50: "#E8F2F1",
          100: "#D1E5E4",
          200: "#A3CBC9",
          300: "#75B1AE",
          400: "#479793",
          500: "#226D68",
          600: "#1B5753",
          700: "#14413E",
          800: "#0E2C2A",
          900: "#071615",
        },
        background: "#ECF8F6",
        accent: {
          DEFAULT: "#FEEAA1",
          50: "#FFFDF7",
          100: "#FFF9E8",
          200: "#FEF4D1",
          300: "#FEEFBA",
          400: "#FEEAA1",
          500: "#FDE588",
          600: "#FDE06F",
          700: "#FCDB56",
          800: "#FCD63D",
          900: "#FBD124",
        },
        highlight: {
          DEFAULT: "#D6955B",
          50: "#F7EEE5",
          100: "#EFDDCB",
          200: "#DFBB97",
          300: "#CF9963",
          400: "#D6955B",
          500: "#C17F3F",
          600: "#9A6532",
          700: "#734B25",
          800: "#4D3219",
          900: "#26190C",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

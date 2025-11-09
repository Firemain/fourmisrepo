import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#18534F",
          50: "#E6F2F1",
          100: "#CCE5E3",
          200: "#99CBC7",
          300: "#66B1AB",
          400: "#33978F",
          500: "#18534F",
          600: "#13423F",
          700: "#0E322F",
          800: "#0A211F",
          900: "#051110",
        },
        secondary: {
          DEFAULT: "#226D68",
          50: "#E8F3F2",
          100: "#D1E7E5",
          200: "#A3CFCB",
          300: "#75B7B1",
          400: "#479F97",
          500: "#226D68",
          600: "#1B5753",
          700: "#14413E",
          800: "#0E2C2A",
          900: "#071615",
        },
        background: "#ECF8F6",
        accent: "#FEEAA1",
        highlight: "#D6955B",
      },
      backgroundSize: {
        'size-200': '200% 200%',
      },
      backgroundPosition: {
        'pos-0': '0% 0%',
        'pos-100': '100% 100%',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(5deg)' },
        },
        'float-delayed': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-30px) rotate(-5deg)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        gradient: 'gradient 3s ease infinite',
        float: 'float 6s ease-in-out infinite',
        'float-delayed': 'float-delayed 8s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

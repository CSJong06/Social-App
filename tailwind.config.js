/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5',
        'primary-hover': '#4338CA',
        secondary: '#10B981',
        accent: '#F59E0B',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'border-color': '#E5E7EB',
        'card-bg': '#FFFFFF',
        'hover-bg': '#F9FAFB',
      },
    },
  },
  plugins: [],
} 
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    safelist: [
        { pattern: /(bg|text|border)-(blue|purple|emerald)-(400|500|600)/ }
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Open Sans', 'sans-serif'],
                display: ['Montserrat', 'sans-serif'],
            },
            colors: {
                brand: {
                    dark: '#0f172a',
                    primary: '#3b82f6',
                    accent: '#8b5cf6',
                },
                'brand-teal': '#14b8a6'
            },
            backgroundImage: {
                'hero-pattern': "linear-gradient(to right bottom, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
            },
            boxShadow: {
                glow: "0 8px 28px rgba(20,184,166,.25), 0 2px 6px rgba(0,0,0,.25)",
            }
        },
    },
    plugins: [],
}
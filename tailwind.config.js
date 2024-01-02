/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './components/**/*.vue',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}'
    ],
    theme: {
        screens: {
            sm: '420px',
            md: '768px',
            lg: '1024px',
            xl: '1280px'
        },
        fontSize: {
            sm: '0.9rem',
            base: '16px',
            'base-plus': '1.2rem',
            l: '24px',
            xl: '32px'
        },
        colors: {
            transparent: 'transparent',
            currentColor: 'currentColor',
            white: '#FFFFFF',
            primary: 'var(--primary)',
            secondary: 'var(--secondary)',
            accent: 'var(--accent)',
            black: '#000000',
            text: '#040316',
            background: '#fffff0',
            'dark-text': '#fffff0',
            'dark-background': '#191971',
            'dark-primary': '#00606b',
            'dark-secondary': '#8d4485',
            'dark-accent': '#f5f5db',
            'dark-accent-green': '#80FF00',
            'error-border': '#F41A1A',
            'error-background': '#F98A8A',
            'gray-text-disabled': '#A7A7AD',
            'gray-text': '#979797',
            'gray-background': '#d5d5d5',
            'gray-primary': '#767676',
            'gray-secondary': '#dedede',
            'gray-accent': '#5b5b5b'
        },
        extend: {
            minHeight: {
                pictures: '220px',
                'pictures-large': '350px'
            },
            maxHeight: {
                pictures: '500px',
                'pictures-large': '700px'
            }
        }
    },
    plugins: []
};

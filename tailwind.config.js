/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}'
    ],
    theme: {
        darkMode: ['class'],
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
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'var(--primary)',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'var(--secondary)',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out'
            }
        }
    },
    plugins: [require('tailwindcss-animate')]
};

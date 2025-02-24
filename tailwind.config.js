import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
                inter:['Inter','serif'],

            },
            colors:{
                navcolor: '#FF9F29',
                btncolor: '#FF9F29',
                bgmenu: '#1E1E1E',
                footercolor: '#111827',
                logocolor: '#ff4500'
            },
        },
    },

    plugins: [forms],
};

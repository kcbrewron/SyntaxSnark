// tailwind.config.js
module.exports = {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    darkMode: 'class', // or 'media' if you prefer system settings
    theme: {
      extend: {
        colors: {
          // Light theme colors
          'snark': {
            50: '#FFF5F5',
            100: '#FFEBEB',
            200: '#FFCDCE',
            300: '#FFA8AB',
            400: '#FF7A80', // lighter coral
            500: '#FF5A5F', // coral pink (primary)
            600: '#E63E43',
            700: '#C52F33',
            800: '#9A2226',
            900: '#7A1A1E',
          },
          'blueish': {
            50: '#F0F4F8',
            100: '#D9E2EC',
            200: '#BCCCDC',
            300: '#9FB3C8',
            400: '#829AB1',
            500: '#627D98',
            600: '#486581',
            700: '#3D5A80', // deep blue (secondary)
            800: '#2D3748',
            900: '#1A202C',
          },
          
          // Light theme general colors
          light: {
            bg: '#F8F9FA',
            surface: '#FFFFFF',
            text: {
              primary: '#2D3748',
              secondary: '#718096',
            },
            border: '#E2E8F0',
            success: '#38A169',
            error: '#E53E3E',
            warning: '#ECC94B',
            code: {
              bg: '#F7F7F7',
            },
          },
          
          // Dark theme general colors
          dark: {
            bg: '#1A202C',
            surface: '#2D3748',
            text: {
              primary: '#F7FAFC',
              secondary: '#A0AEC0',
            },
            border: '#4A5568',
            success: '#68D391',
            error: '#FC8181',
            warning: '#F6E05E',
            code: {
              bg: '#2A2E37',
            },
          },
        },
      },
    },
    plugins: [],
  }
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // SAP Horizon theme color palette
        'sap-blue':       '#0070F3',
        'sap-blue-dark':  '#0040B0',
        'sap-green':      '#188918',
        'sap-orange':     '#E76500',
        'sap-red':        '#AA0808',
        'sap-gray':       '#556B82'
      },
      fontFamily: {
        sans: ['"72"', '"72full"', 'Arial', 'Helvetica', 'sans-serif']
      }
    }
  },
  plugins: []
}

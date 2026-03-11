import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// SAP UI5 Web Components React — register all assets (icons, i18n bundles, theme vars)
// This import must run before any UI5 component is rendered.
import '@ui5/webcomponents-react/dist/Assets.js'
import '@ui5/webcomponents-fiori/dist/Assets.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

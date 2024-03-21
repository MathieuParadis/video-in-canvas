// REACT IMPORT
import React from 'react'

// REACT-DOM IMPORT
import ReactDOM from 'react-dom/client'

// APP IMPORT
import App from './App'

// STYLES IMPORTS
import './styles/index.css'

const rootElement = document.getElementById('root')
if (rootElement == null) throw new Error('Failed to find the root element')

const root = ReactDOM.createRoot(rootElement)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

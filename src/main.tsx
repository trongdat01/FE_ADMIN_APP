import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Import connection test utilities (for browser console)
import './utils/connection-test'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

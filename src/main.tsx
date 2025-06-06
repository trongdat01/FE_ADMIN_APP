import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Import connection test utilities (for browser console)
import './utils/connection-test'

createRoot(document.getElementById('root')!).render(
  <App />
)

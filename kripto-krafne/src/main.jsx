import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <GoogleOAuthProvider clientId="952913949861-jmuevt7ajs4ao9mst0eo6lnau14c8k3k.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
  </StrictMode>,
)

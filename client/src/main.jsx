import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AppContextProvider } from './context/AppContext.jsx'
import { ClerkProvider } from './lib/auth.jsx'
import { installLegacyBackendFetchShim } from './lib/backend.js'

installLegacyBackendFetchShim()

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ClerkProvider>
      <AppContextProvider>
        <App />
      </AppContextProvider>
    </ClerkProvider>
  </BrowserRouter>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthenProvider } from './contexts/AuthenContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_GOOGLE_ID}>
    <React.StrictMode>
      <BrowserRouter>
        <AuthenProvider>
          <App />
          <Toaster />
        </AuthenProvider>
      </BrowserRouter>
    </React.StrictMode >
  </GoogleOAuthProvider>

);
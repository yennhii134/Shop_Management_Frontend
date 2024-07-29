import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthenProvider } from './contexts/AuthenContext.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthenProvider>
        <App />
        <Toaster />
      </AuthenProvider>
    </BrowserRouter>
  </React.StrictMode >
);


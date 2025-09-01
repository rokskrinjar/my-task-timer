import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { optimizeForMobile } from './utils/mobileOptimizations'

// Initialize mobile optimizations
optimizeForMobile();

createRoot(document.getElementById("root")!).render(<App />);

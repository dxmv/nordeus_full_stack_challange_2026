import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { RunConfigProvider } from './context/RunConfigContext.tsx'
import { PlayerProvider } from './context/PlayerContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RunConfigProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </RunConfigProvider>
  </StrictMode>,
)

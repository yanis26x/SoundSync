import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Info from './Info.jsx'
import Profil from './Profil.jsx'

const routes = {
  '/': App,
  '/info': Info,
  '/Profil': Profil,
  '/profil': Profil,
}
const RootPage = routes[window.location.pathname] || App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootPage />
  </StrictMode>,
)

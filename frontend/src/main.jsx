import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import Profil from './Pages/Profil/Profil.jsx'

const routes = {
  '/': App,
  '/transfer': App,
  '/Transfer': App,
  '/profil': Profil,
  '/Profil': Profil,
}
const RootPage = routes[window.location.pathname] || App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootPage />
  </StrictMode>,
)

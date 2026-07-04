import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Menu from './Pages/Menu/Menu.jsx'
import Profil from './Pages/Profil/Profil.jsx'

const routes = {
  '/': Menu,
  '/transfer': Menu,
  '/Transfer': Menu,
  '/profil': Profil,
  '/Profil': Profil,
}
const RootPage = routes[window.location.pathname] || Menu

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootPage />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Menu from './Pages/Menu/Menu.jsx'
import Profil from './Pages/Profil/Profil.jsx'
import Info from './Pages/Info/Info.jsx'

const routes = {
  '/': Menu,
  '/transfer': Menu,
  '/Transfer': Menu,
  '/profil': Profil,
  '/Profil': Profil,
  '/info': Info,
  '/Info': Info,
}
const RootPage = routes[window.location.pathname] || Menu

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RootPage />
  </StrictMode>,
)

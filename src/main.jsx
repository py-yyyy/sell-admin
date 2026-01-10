import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import routes from './router/index.jsx'
import { RouterProvider } from 'react-router-dom'
import App from './App.jsx'
import '@/common/base.scss'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <RouterProvider router={routes}/>
  </StrictMode>,
)

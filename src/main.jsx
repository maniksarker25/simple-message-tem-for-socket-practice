import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './routes/routes.jsx'
import { SocketProvider } from './Context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
<SocketProvider>    <RouterProvider router={router}></RouterProvider></SocketProvider>
  </StrictMode>,
)

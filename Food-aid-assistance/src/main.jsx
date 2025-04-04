import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RiskForm from './Components/RiskForm'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RiskForm />
  </StrictMode>,
)

import { StrictMode } from 'react'
import './index.css'
import ReactDOM from 'react-dom/client';
import App from './App';
import MediFindProvider from './context/MediFindContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MediFindProvider>
      <App />
    </MediFindProvider>
  </StrictMode>,
)


import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';  // Changed from '../src/index.css' to './index.css'

createRoot(document.getElementById("root")!).render(<App />);

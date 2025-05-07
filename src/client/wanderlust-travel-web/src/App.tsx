
import './App.css'
import { AuthProvider } from './store/AuthContext';
import Navbar from './components/header/navbar';
import { BrowserRouter } from 'react-router-dom';
import Router from './router/index';
function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Router />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

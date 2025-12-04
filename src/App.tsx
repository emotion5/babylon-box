import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GLBLoader from './pages/GLBLoader'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/glbloader" element={<GLBLoader />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GLBLoader from './pages/GLBLoader'
import MaterialDemo from './pages/MaterialDemo'
import BoxResizer from './pages/BoxResizer'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/glbloader" element={<GLBLoader />} />
        <Route path="/materialdemo" element={<MaterialDemo />} />
        <Route path="/boxresizer" element={<BoxResizer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

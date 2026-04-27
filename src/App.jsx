import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Reader from './pages/Reader'
import Admin from './pages/Admin'
import Layout from './components/Layout'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story/:id" element={<Reader />} />
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
    </Layout>
  )
}

export default App

import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./component/Dashboard"
import Users from './pages/Users';
import Roles from './pages/Roles'
import './App.css'
const App = () => {
  return (
    <>
      <Router>
        <>
          <Routes>
            <Route path="/" element={<Dashboard/>}>
              <Route path="/" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
            </Route>

          </Routes>
        </>
      </Router>
    </>

  )
}

export default App
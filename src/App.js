import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from "./Dashboard"
import Users from './Users';
import AddUser from './AddUser';
import Roles from './Roles'
const App = () => {
  return (
    <>
      <Router>
        <>
          {/* Define your routes */}
          <Routes>
            <Route path="/" element={<Dashboard/>}>
              {/* Nested routes */}
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
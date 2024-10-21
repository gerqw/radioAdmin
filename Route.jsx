import { Routes, Route } from "react-router-dom"
import Dashboard from "./layouts/Dashboard"
import Search from "./layouts/Search"


function Aplicacion() {
  return (
    <div className="Dashoard">
      <Routes>
        <Route path="/" element={ <Dashboard /> } />
        <Route path="search" element={ <Search /> } />
      </Routes>
    </div>
  )
}

export default Aplicacion
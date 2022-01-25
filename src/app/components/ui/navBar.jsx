import React from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { getLogged } from "../../store/users"
import NavProfile from "./navProfile"

const NavBar = () => {
  // const currentUser = useSelector(getCurrentUser())
  const isLogged = useSelector(getLogged())

  return (
    <nav className="navbar bg-light mb-3">
      <div className="container-fluid">
        <ul className="nav">
          {isLogged && (
            <li className="nav-item">
              <Link className="nav-link " aria-current="page" to="/users">
                Users
              </Link>
            </li>
          )}
          <li className="nav-item">
            <Link className="nav-link " aria-current="page" to="/">
              Main
            </Link>
          </li>
        </ul>
        <div className="d-flex">
          {isLogged ? (
            <NavProfile />
          ) : (
            <Link className="nav-link " aria-current="page" to="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar

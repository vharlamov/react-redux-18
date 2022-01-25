import React, { useState } from "react"
import { Link } from "react-router-dom"
import defAva from "../../assets/defAva.png"
import { useSelector } from "react-redux"
import { getAuthUser, getCurrentUser } from "../../store/users"

const NavProfile = () => {
  const currentUserId = useSelector(getAuthUser())
  const currentUser = useSelector(getCurrentUser())
  const [isOpen, setOpen] = useState(false)

  const toggleMenu = () => {
    setOpen(!isOpen)
  }

  if (!currentUser) return "Loading..."

  return (
    <div className="dropdown" onClick={toggleMenu}>
      <div className="btn dropdown-toggle d-flex align-items-center">
        <div className="me-2">{currentUser.name}</div>
        <img
          src={currentUser.image ? currentUser.image : defAva}
          height="40px"
          alt=""
          className="img-responsive rounded-circle"
        />
      </div>
      <div className={"w-100 dropdown-menu" + (isOpen ? " show" : "")}>
        <Link to={`/users/${currentUserId}`} className="dropdown-item">
          Profile
        </Link>
        <Link to="/logout" className="dropdown-item">
          Logout
        </Link>
      </div>
    </div>
  )
}

export default NavProfile

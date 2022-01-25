import React from "react"
import PropTypes from "prop-types"
import { useHistory } from "react-router"
import defAva from "../../assets/defAva.png"
import { useSelector } from "react-redux"
import { getProfessionById } from "../../store/professions"
import { getAuthUser } from "../../store/users"

const UserCard = ({ user }) => {
  const history = useHistory()
  const currentUserId = useSelector(getAuthUser())
  const handleClick = () => {
    history.push(history.location.pathname + "/edit")
  }

  const getProfession = (id) => {
    return useSelector(getProfessionById(id))
  }

  return (
    <div className="card mb-3">
      <div className="card-body">
        {currentUserId === user._id ? (
          <button
            className="position-absolute top-0 end-0 btn btn-light btn-sm"
            onClick={handleClick}
          >
            <i className="bi bi-gear"></i>
          </button>
        ) : null}
        <div className="d-flex flex-column align-items-center text-center position-relative">
          <img
            src={user.image ? user.image : defAva}
            className="rounded-circle"
            width="150"
          />
          <div className="mt-3">
            <h4>{user.name}</h4>
            <p className="text-secondary mb-1">
              {getProfession(user.profession).name}
            </p>
            <div className="text-muted">
              <i
                className="bi bi-caret-down-fill text-primary"
                role="button"
              ></i>
              <i className="bi bi-caret-up text-secondary" role="button"></i>
              <span className="ms-2">{user.rate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
UserCard.propTypes = {
  user: PropTypes.object
}

export default UserCard

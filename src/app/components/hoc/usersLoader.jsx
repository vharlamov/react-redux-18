import { useEffect } from "react"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import { getAuthUser, getDataStatus, loadUsersList } from "../../store/users"

const UsersLoader = ({ children }) => {
  const dataStatus = useSelector(getDataStatus())
  const dispatch = useDispatch()
  const userId = useSelector(getAuthUser())

  useEffect(() => {
    if (!dataStatus) dispatch(loadUsersList())
  }, [dataStatus])

  if (!dataStatus) return "Loading..."

  return children
}

UsersLoader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default UsersLoader

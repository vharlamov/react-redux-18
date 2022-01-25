import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"
import { getLoadingStatus, getLogged, loadUsersList } from "../../store/users"
import { loadQualitiesList } from "../../store/qualities"
import { loadProfList } from "../../store/professions"
import { useEffect } from "react"

const AppLoader = ({ children }) => {
  const dispatch = useDispatch()
  const isLogged = useSelector(getLogged())
  const isLoading = useSelector(getLoadingStatus())

  useEffect(() => {
    dispatch(loadQualitiesList())
    dispatch(loadProfList())
    if (isLogged) {
      dispatch(loadUsersList())
    }
  }, [isLogged])

  if (isLoading) return "Loading..."

  return children
}

AppLoader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default AppLoader

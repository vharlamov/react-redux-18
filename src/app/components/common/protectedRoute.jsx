import React from "react"
import { Route, Redirect } from "react-router-dom"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import { getAuthUser, getLogged } from "../../store/users"

const ProtectedRoute = ({
  component: Component,
  children,
  computedMatch,
  ...rest
}) => {
  const isLogged = useSelector(getLogged())
  const currentUserId = useSelector(getAuthUser())
  const { userId, edit } = computedMatch.params
  if (!currentUserId) return "Loading..."

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!isLogged) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location
                }
              }}
            />
          )
        }

        if (edit && currentUserId !== userId) {
          return <Redirect to="/" />
        }

        return Component ? <Component {...props} /> : children
      }}
    />
  )
}

ProtectedRoute.propTypes = {
  component: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  location: PropTypes.object,
  computedMatch: PropTypes.object
}

export default ProtectedRoute

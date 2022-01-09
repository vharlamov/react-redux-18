import React from "react"
import { useAuth } from "../../hooks/useAuth"
import { Route, Redirect, useParams } from "react-router-dom"
import PropTypes from "prop-types"

const ProtectedRoute = ({
  component: Component,
  children,
  computedMatch,
  ...rest
}) => {
  const { currentUser } = useAuth()
  const { userId, edit } = computedMatch.params

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!currentUser) {
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

        if (edit && currentUser._id !== userId) {
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

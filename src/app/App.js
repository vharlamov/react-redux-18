import React, { useEffect } from "react"
import { Route, Switch, Redirect } from "react-router-dom"

import Users from "./layouts/users"
import Login from "./layouts/login"
import LogOut from "./layouts/logout"
import Main from "./layouts/main"
import NavBar from "./components/ui/navBar"
import { ToastContainer } from "react-toastify"
import AuthProvider from "./hooks/useAuth"
import UserProvider from "./hooks/useUsers"
import ProtectedRoute from "./components/common/protectedRoute"
import { useDispatch, useStore } from "react-redux"
import { loadQualitiesList } from "./store/qualities"
import { loadProfList } from "./store/professions"
import { loadUsersList } from "./store/users"

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUsersList())
    dispatch(loadQualitiesList())
    dispatch(loadProfList())
  }, [])

  return (
    <div>
      <AuthProvider>
        <NavBar />
        <Switch>
          <ProtectedRoute path="/users/:userId?/:edit?" component={Users} />
          <Route path="/logout" component={LogOut} />
          <Route path="/login/:type?" component={Login} />
          <Route path="/" exact component={Main} />
          <Redirect to="/" />
        </Switch>
      </AuthProvider>
      <ToastContainer />
    </div>
  )
}

export default App

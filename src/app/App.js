import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"

import Users from "./layouts/users"
import Login from "./layouts/login"
import LogOut from "./layouts/logout"
import Main from "./layouts/main"
import NavBar from "./components/ui/navBar"
import { ToastContainer } from "react-toastify"
import AuthProvider from "./hooks/useAuth"
import ProtectedRoute from "./components/common/protectedRoute"
import AppLoader from "./components/hoc/appLoader"

function App() {
  return (
    <div>
      <AppLoader>
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
      </AppLoader>
      <ToastContainer />
    </div>
  )
}

export default App

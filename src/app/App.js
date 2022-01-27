import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"

import Users from "./layouts/users"
import Login from "./layouts/login"
import LogOut from "./layouts/logout"
import Main from "./layouts/main"
import NavBar from "./components/ui/navBar"
import { ToastContainer } from "react-toastify"
import ProtectedRoute from "./components/common/protectedRoute"
import AppLoader from "./components/hoc/appLoader"

function App() {
  return (
    <div>
      <AppLoader>
        <NavBar />
        <Switch>
          <ProtectedRoute path="/users/:userId?/:edit?" component={Users} />
          <Route path="/logout" component={LogOut} />
          <Route path="/login/:type?" component={Login} />
          <Route path="/" exact component={Main} />
          <Redirect to="/" />
        </Switch>
      </AppLoader>
      <ToastContainer />
    </div>
  )
}

export default App

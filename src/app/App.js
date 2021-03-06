import React from "react"
import { Route, Switch, Redirect } from "react-router-dom"

import Users from "./layouts/users"
import Login from "./layouts/login"
import LogOut from "./layouts/logout"
import Main from "./layouts/main"
import NavBar from "./components/ui/navBar"
import { ToastContainer } from "react-toastify"
import { ProfessionProvider } from "./hooks/useProfession"
import { QualitiesProvider } from "./hooks/useQualities"
import AuthProvider from "./hooks/useAuth"
import UserProvider from "./hooks/useUsers"
import ProtectedRoute from "./components/common/protectedRoute"

function App() {
  return (
    <div>
      <AuthProvider>
        <NavBar />
        <UserProvider>
          <QualitiesProvider>
            <ProfessionProvider>
              <Switch>
                <ProtectedRoute
                  path="/users/:userId?/:edit?"
                  component={Users}
                />
                <Route path="/logout" component={LogOut} />
                <Route path="/login/:type?" component={Login} />
                <Route path="/" exact component={Main} />
                <Redirect to="/" />
              </Switch>
            </ProfessionProvider>
          </QualitiesProvider>
        </UserProvider>
      </AuthProvider>
      <ToastContainer />
    </div>
  )
}

export default App

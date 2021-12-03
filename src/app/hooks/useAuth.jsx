import React, { useContext, useEffect, useState } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import userService from "../services/user.service"
import { toast } from "react-toastify"
import { setTokens } from "../services/localStorage.service"

export const httpAuth = axios.create()
const AuthContext = React.createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

// const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_KEY}`

const getUrl = (action) => {
  return `https://identitytoolkit.googleapis.com/v1/accounts:${action}?key=${process.env.REACT_APP_FIREBASE_KEY}`
}

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({})
  const [error, setError] = useState(null)

  async function signUp({ email, password, ...rest }) {
    try {
      const { data } = await httpAuth.post(getUrl("signUp"), {
        email,
        password,
        returnSecureToken: true
      })

      setTokens(data)
      await createUser({ _id: data.localId, email, ...rest })
    } catch (error) {
      errorCatcher(error)
      const { code, message } = error.response.data.error

      if (code === 400) {
        const errorObject = {
          email: "Пользователь с таким email уже существует"
        }
        if (message === "EMAIL_EXISTS") {
          throw errorObject
        }
      }
    }
  }

  async function signIn({ email, password }) {
    try {
      const { data } = await httpAuth.post(getUrl("signInWithPassword"), {
        email,
        password,
        returnSecureToken: true
      })

      setTokens(data)
    } catch (error) {
      errorCatcher(error)
      const { code, message } = error.response.data.error

      if (code === 400) {
        const errorObject = {
          password: { password: "Неверный пароль" },
          email: { email: "Пользователь отсутствует. Зарегистрируйтесь" }
        }
        if (message === "INVALID_PASSWORD") {
          throw errorObject.password
        } else if (message === "EMAIL_NOT_FOUND") {
          throw errorObject.email
        }
      }
    }
  }

  async function createUser(data) {
    try {
      const { content } = await userService.create(data)
      setCurrentUser(content)
    } catch (error) {
      errorCatcher(error)
    }
  }

  function errorCatcher(error) {
    const { message } = error.response.data
    setError(message)
  }

  useEffect(() => {
    if (error !== null) {
      toast(error)
      setError(null)
    }
  }, [error])

  return (
    <AuthContext.Provider value={{ signUp, signIn }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

export default AuthProvider

import React, { useContext, useEffect, useState } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import userService from "../services/user.service"
import { toast } from "react-toastify"
import localStorageService, {
  setTokens,
  getUserId,
  getAccessToken
} from "../services/localStorage.service"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

const baseURL = "https://identitytoolkit.googleapis.com/v1/"

export const httpAuth = axios.create({
  baseURL,
  params: {
    key: process.env.REACT_APP_FIREBASE_KEY
  }
})

const AuthContext = React.createContext()

export const useAuth = () => {
  return useContext(AuthContext)
}

const getUrl = (action) => {
  return `${baseURL}accounts:${action}`
}

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState()
  const [error, setError] = useState(null)
  const [isLoading, setLoading] = useState(true)
  const history = useHistory()

  function randomInt(min, max) {
    return Math.round(Math.random() * (max - min) + min)
  }

  async function signUp({ email, password, ...rest }) {
    try {
      const { data } = await httpAuth.post(getUrl("signUp"), {
        email,
        password,
        returnSecureToken: true
      })

      setTokens(data)
      getUserId()

      await createUser({
        _id: data.localId,
        email,
        rate: randomInt(1, 5),
        completedMeetings: randomInt(0, 200),
        image: `https://avatars.dicebear.com/api/avataaars/${(Math.random() + 1)
          .toString(36)
          .substring(7)}.svg`,
        ...rest
      })
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

  function logOut() {
    localStorageService.removeAuthData()
    setCurrentUser(null)
    history.push("/")
  }

  async function signIn({ email, password }) {
    try {
      const { data } = await httpAuth.post(getUrl("signInWithPassword"), {
        email,
        password,
        returnSecureToken: true
      })

      setTokens(data)
      await getUserData()
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
      console.log(content)
      setCurrentUser(content)
    } catch (error) {
      errorCatcher(error)
    }
  }

  async function updateUser({ _id, email, password, ...rest }) {
    try {
      const { data } = await httpAuth.post(getUrl("update"), {
        idToken: getAccessToken(),
        email,
        password,
        returnSecureToken: true
      })

      if (data.idToken && data.refreshToken) {
        setTokens(data)
      }

      const userData = { _id, email, ...rest }

      await updateCurrentUser(userData)
    } catch (error) {
      errorCatcher(error)
      const { code, message } = error.response.data.error
    } finally {
      setLoading(false)
    }
  }

  async function updateCurrentUser(data) {
    try {
      const { content } = await userService.updateUser(data)
      console.log(content)
      setCurrentUser(content)
    } catch (error) {
      errorCatcher(error)
    }
  }

  function errorCatcher(error) {
    const { message } = error.response.data
    setError(message)
  }

  async function getUserData() {
    try {
      const { content } = await userService.getCurrentUser()
      setCurrentUser(content)
    } catch (error) {
      errorCatcher(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (error !== null) {
      toast(error)
      setError(null)
    }
  }, [error])

  useEffect(() => {
    if (localStorageService.getAccessToken()) {
      getUserData()
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{ signUp, signIn, logOut, updateUser, currentUser }}
    >
      {!isLoading ? children : "Loading..."}
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

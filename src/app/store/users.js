import { createAction, createSlice } from "@reduxjs/toolkit"
import authService from "../services/auth.service"
import localStorageService from "../services/localStorage.service"
import userService from "../services/user.service"
import history from "../utils/history"
import randomInt from "../utils/randomInt"

const initialState = localStorageService.getAccessToken()
  ? {
      entities: null,
      isLoading: true,
      error: null,
      auth: { userId: localStorageService.getUserId() },
      isLoggedIn: true,
      dataLoaded: false
    }
  : {
      entities: null,
      isLoading: false,
      error: null,
      auth: null,
      isLoggedIn: false,
      dataLoaded: false
    }

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    usersRequested(state) {
      state.isLoading = true
    },
    usersReceived(state, action) {
      state.entities = action.payload
      state.isLoading = false
      state.dataLoaded = true
    },
    usersRequestFailed(state, action) {
      state.error = action.payload
      state.isLoading = false
    },
    authRequestSuccess(state, action) {
      state.auth = action.payload
      state.isLoggedIn = true
    },
    authRequestFailed(state, action) {
      state.error = action.payload
      state.isLoggedIn = false
    },
    userCreated(state, action) {
      state.entities.push(action.payload)
      state.isLoggedIn = true
    },
    userCreateFailed(state, action) {
      state.error = action.payload
      state.isLoggedIn = false
    },
    authLogout(state) {
      state.isLoggedIn = false
      state.auth = null
      state.dataLoaded = false
      state.entities = null
    }
  }
})

const { actions, reducer: usersReducer } = usersSlice
const {
  usersRequestFailed,
  usersReceived,
  usersRequested,
  authRequestSuccess,
  authRequestFailed,
  userCreated,
  userCreateFailed,
  authLogout
} = actions
const authRequested = createAction("users/authRequested")
const userCreateRequested = createAction("users/createRequested")

export const loadUsersList = () => async (dispatch) => {
  dispatch(usersRequested())
  try {
    const { content } = await userService.get()
    dispatch(usersReceived(content))
  } catch (error) {
    dispatch(usersRequestFailed(error.message))
  }
}

function createUser(payload) {
  return async function (dispatch) {
    dispatch(userCreateRequested())
    try {
      const { content } = await userService.create(payload)
      dispatch(userCreated(content))

      history.push("/users")
    } catch (error) {
      dispatch(userCreateFailed(error.message))
    }
  }
}

export const signUp =
  ({ email, password, ...rest }) =>
  async (dispatch) => {
    dispatch(authRequested())
    try {
      const data = await authService.register({ email, password })

      localStorageService.setTokens(data)

      dispatch(
        authRequestSuccess({
          userId: data.localId
        })
      )

      dispatch(
        createUser({
          _id: data.localId,
          email: data.email,
          rate: randomInt(1, 5),
          completedMeetings: randomInt(0, 200),
          image: `https://avatars.dicebear.com/api/avataaars/${(
            Math.random() + 1
          )
            .toString(36)
            .substring(7)}.svg`,
          ...rest
        })
      )
    } catch (error) {
      dispatch(authRequestFailed(error.message))
    }
  }

export const signIn =
  ({ email, password, redirect }) =>
  async (dispatch) => {
    dispatch(authRequested)
    try {
      const data = await authService.login({ email, password })

      localStorageService.setTokens(data)

      dispatch(
        authRequestSuccess({
          userId: data.localId
        })
      )
      history.push(redirect)
    } catch (error) {
      dispatch(authRequestFailed(error.message))
    }
  }

export const logOut = () => async (dispatch) => {
  localStorageService.removeAuthData()
  dispatch(authLogout())
  history.push("/")
}

export const getUsers = () => (state) => state.users.entities

export const getUsersLoading = () => (state) => state.users.isLoading
export const getUserById = (id) => (state) => {
  const users = state.users.entities
  if (users) {
    return users.find((user) => user._id === id)
  }
}
export const getLogged = () => (state) => state.users.isLoggedIn
export const getAuthUser = () => (state) => state.users.auth.userId
export const getDataStatus = () => (state) => state.users.dataLoaded
export const getLoadingStatus = () => (state) => state.users.isLoading
export const getCurrentUser = () => (state) => {
  return state.users.entities
    ? state.users.entities.find((u) => u._id === state.users.auth?.userId)
    : null
}

export default usersReducer

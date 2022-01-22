import { createAction, createSlice } from "@reduxjs/toolkit"
import authService from "../services/auth.service"
import localStorageService from "../services/localStorage.service"
import userService from "../services/user.service"
import history from "../utils/history"
import randomInt from "../utils/randomInt"

const usersSlice = createSlice({
  name: "users",
  initialState: {
    entities: null,
    isLoading: true,
    error: null,
    auth: null,
    isLoggedIn: false
  },
  reducers: {
    usersRequested(state) {
      state.isLoading = true
    },
    usersReceived(state, action) {
      state.entities = action.payload
      console.log("usersReceived", state.entities)
      state.isLoading = false
    },
    userRequestFailed(state, action) {
      state.error = action.payload
      state.isLoading = false
    },
    authRequestSuccess(state, action) {
      state.auth = action.payload
      state.isLoggedIn = true
    },
    authRequestFailed(state, action) {
      console.log("error", action.payload)

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
    }
  }
})

const { actions, reducer: usersReducer } = usersSlice
const {
  userRequestFailed,
  usersReceived,
  usersRequested,
  authRequestSuccess,
  authRequestFailed,
  userCreated,
  userCreateFailed
} = actions
const authRequested = createAction("users/authRequested")
const userCreateRequested = createAction("users/createRequested")

export const loadUsersList = () => async (dispatch) => {
  dispatch(usersRequested())
  try {
    const { content } = await userService.get()
    dispatch(usersReceived(content))
  } catch (error) {
    dispatch(userRequestFailed(error.message))
  }
}

function createUser(payload) {
  console.log("create 1")
  return async function (dispatch) {
    console.log("create 2")

    dispatch(userCreateRequested())
    try {
      const { content } = await userService.create(payload)
      dispatch(userCreated(content))
      console.log("create 3")

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
  ({ email, password }) =>
  async (dispatch) => {
    console.log("signIn 1")
    dispatch(authRequested)
    try {
      const data = await authService.login({ email, password })

      localStorageService.setTokens(data)

      dispatch(
        authRequestSuccess({
          userId: data.localId
        })
      )
      history.push("/users")
    } catch (error) {
      console.log("error users")
      dispatch(authRequestFailed(error.message))
    }
  }

export const getUsers = () => (state) => {
  console.log("state", state)
  return state.users.entities
}
export const getUsersLoading = () => (state) => state.users.isLoading
export const getUserById = (id) => (state) => {
  const users = state.users.entities
  if (users) {
    return users.find((user) => user._id === id)
  }
}
export default usersReducer

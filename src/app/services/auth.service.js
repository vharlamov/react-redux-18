import httpService from "./http.service"
import axios from "axios"
import localStorageService from "./localStorage.service"

const baseURL = "https://identitytoolkit.googleapis.com/v1/"

export const httpAuth = axios.create({
  baseURL,
  params: {
    key: process.env.REACT_APP_FIREBASE_KEY
  }
})

const getUrl = (action, id = "") => {
  return `${baseURL}accounts:${action}`
}

const authService = {
  register: async ({ email, password }) => {
    const { data } = await httpAuth.post(getUrl("signUp"), {
      email,
      password,
      returnSecureToken: true
    })
    return data
  },
  login: async ({ email, password }) => {
    const { data } = await httpAuth.post(getUrl("signInWithPassword"), {
      email,
      password,
      returnSecureToken: true
    })
    return data
  },
  update: async ({ _id, email, password }) => {
    const { data } = await httpAuth.post(getUrl("update"), {
      idToken: localStorageService.getAccessToken(),
      email,
      password,
      returnSecureToken: true
    })
    return data
  },
  refresh: async () => {
    const { data } = await httpAuth.post("token", {
      grant_type: "refresh_token",
      refresh_token: localStorageService.getRefreshToken()
    })
    return data
  }
}

export default authService

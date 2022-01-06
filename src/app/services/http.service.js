import axios from "axios"
import { toast } from "react-toastify"
import configFile from "../config.json"
import { httpAuth } from "../hooks/useAuth"
import localStorageService, { setTokens } from "./localStorage.service"

const http = axios.create({ baseURL: configFile.apiEndpoint })

http.interceptors.request.use(
  async function (config) {
    // console.log("httpservice", config)
    if (configFile.isFirebase) {
      const containSlash = /\/$/gi.test(config.url)
      config.url =
        (containSlash ? config.url.slice(0, -1) : config.url) + ".json"

      const expiresDate = localStorageService.getExpires()
      const refreshToken = localStorageService.getRefreshToken()

      if (refreshToken && expiresDate < Date.now()) {
        const { data } = await httpAuth.post("token", {
          grant_type: "refresh_token",
          refresh_token: refreshToken
        })

        setTokens({
          idToken: data.id_token,
          refreshToken: data.refresh_token,
          localId: data.user_id,
          expiresIn: data.expires_in
        })
      }

      const accessToken = localStorageService.getAccessToken()

      if (accessToken) {
        config.params = { ...config.params, auth: accessToken }
      }
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

function transformData(data) {
  return data && !data._id
    ? Object.keys(data).map((key) => ({ ...data[key] }))
    : data
}

http.interceptors.response.use(
  (res) => {
    if (configFile.isFirebase) {
      res.data = { content: transformData(res.data) }
      return res
    }
    return res
  },
  function (error) {
    const expectedErrors =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500

    if (!expectedErrors) {
      console.log(error)
      toast.error("Somthing was wrong. Try it later")
    }
    return Promise.reject(error)
  }
)
const httpService = {
  get: http.get,
  post: http.post,
  put: http.put,
  delete: http.delete
}
export default httpService

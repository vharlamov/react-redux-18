import { combineReducers, configureStore } from "@reduxjs/toolkit"
import profReduser from "./professions"
import qualitiesReducer from "./qualities"
import usersReducer from "./users"

const rootReducer = combineReducers({
  qualities: qualitiesReducer,
  professions: profReduser,
  users: usersReducer
})

export function createStore() {
  return configureStore({
    reducer: rootReducer
  })
}

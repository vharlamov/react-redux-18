import { combineReducers, configureStore } from "@reduxjs/toolkit"
import profReduser from "./professions"
import qualitiesReducer from "./qualities"

const rootReducer = combineReducers({
  qualities: qualitiesReducer,
  professions: profReduser
})

export function createStore() {
  return configureStore({
    reducer: rootReducer
  })
}

import { createSlice } from "@reduxjs/toolkit"
import professionService from "../services/profession.service"

const professionsSlice = createSlice({
  name: "professions",
  initialState: {
    entities: null,
    isLoading: true,
    error: null,
    lastFetch: null
  },
  reducers: {
    profRequested(state) {
      state.isLoading = true
    },
    profRecieved(state, action) {
      state.entities = action.payload
      state.isLoading = false
      state.lastFetch = Date.now()
    },
    profRequestFailed(state, action) {
      state.error = action.payload
      state.isLoading = false
    }
  }
})

const { actions, reducer: profReduser } = professionsSlice
const { profRecieved, profRequestFailed, profRequested } = actions

function isOutDate(date) {
  if (Date.now() - date > 10 * 60 * 1000) return true
  return false
}

export const loadProfList = () => async (dispatch, getState) => {
  const { lastFetch } = getState().professions

  if (isOutDate(lastFetch)) {
    dispatch(profRequested())
    try {
      const { content } = await professionService.get()
      dispatch(profRecieved(content))
    } catch (error) {
      dispatch(profRequestFailed(error.message))
    }
  }
}

export const getProfessions = () => (state) => state.professions.entities
export const getProfessionsLoading = () => (state) =>
  state.professions.isLoading
export const getProfessionById = (id) => (state) => {
  if (state.professions.entities) {
    const profs = state.professions.entities
    return profs.find((prof) => prof._id === id)
  }
  return []
}

export default profReduser

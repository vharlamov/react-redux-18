import { createSlice } from "@reduxjs/toolkit"
import qualityService from "../services/qaulity.service"

const qualitiesSlice = createSlice({
  name: "qualities",
  initialState: {
    entities: null,
    isLoading: true,
    error: null,
    lastFetch: null
  },
  reducers: {
    qualitiesRequested(state) {
      state.isLoading = true
    },
    qualitiesReceived(state, action) {
      state.isLoading = false
      state.entities = action.payload
      state.lastFetch = Date.now()
    },
    qualitiesRequestFailed(state, action) {
      state.isLoading = false
      state.error = action.payload
    }
  }
})

const { actions, reducer: qualitiesReducer } = qualitiesSlice
const { qualitiesReceived, qualitiesRequestFailed, qualitiesRequested } =
  actions

function isOutDate(date) {
  if (Date.now() - date > 10 * 60 * 1000) {
    return true
  }
  return false
}

export const loadQualitiesList = () => async (dispatch, getState) => {
  const { lastFetch } = getState().qualities

  if (isOutDate(lastFetch)) {
    dispatch(qualitiesRequested())
    try {
      const { content } = await qualityService.fetchAll()
      dispatch(qualitiesReceived(content))
    } catch (error) {
      dispatch(qualitiesRequestFailed(error.message))
    }
  }
}

export const getQualities = () => (state) => state.qualities.entities
export const getQualitiesLoading = () => (state) => state.qualities.isLoading
export const getQualitiesByIds = (ids) => (state) => {
  if (state.qualities.entities) {
    const qualitiesArray = []
    const quals = state.qualities.entities
    for (const qualId of ids) {
      for (const qual of quals) {
        if (qual._id === qualId) {
          qualitiesArray.push(qual)
          break
        }
      }
    }
    return qualitiesArray
  }
  return []
}
export default qualitiesReducer

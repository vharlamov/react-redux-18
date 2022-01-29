import { createAction, createSlice } from "@reduxjs/toolkit"
import { nanoid } from "nanoid"
import commentService from "../services/comment.service"

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    entities: {
      input: [],
      output: []
    },
    isLoading: true,
    error: null
  },
  reducers: {
    commentsRequested(state) {
      state.isLoading = true
    },
    commentsOutputRecieved(state, action) {
      state.entities.output = action.payload
      state.isLoading = false
    },
    commentsInputRecieved(state, action) {
      state.entities.input = action.payload
      state.isLoading = false
    },
    commentsRequestFailed(state, action) {
      state.error = action.payload
      state.isLoading = false
    },
    commentCreated(state, action) {
      state.entities.output.push(action.payload)
    },
    commentCreateFailed(state, action) {
      state.entities.error = action.payload
    },
    commentRemoved(state, action) {
      state.entities.output = state.entities.output.filter(
        (c) => c._id !== action.payload
      )
    },
    commentRemoveFailed(state, action) {
      state.entities.error = action.payload
    }
  }
})

const { actions, reducer: commentsReducer } = commentsSlice
const {
  commentsInputRecieved,
  commentsOutputRecieved,
  commentsRequestFailed,
  commentsRequested,
  commentCreated,
  commentRemoved,
  commentCreateFailed,
  commentRemoveFailed
} = actions

const commentCreateRequested = createAction("comments/commentCreateRequest")
const commentRemoveRequested = createAction("comments/commentRemoveRequest")

export const loadOutputCommentsList = (id) => async (dispatch) => {
  dispatch(commentsRequested())
  try {
    const { content } = await commentService.getOutput(id)
    dispatch(commentsOutputRecieved(content))
  } catch (error) {
    dispatch(commentsRequestFailed(error.message))
  }
}

export const loadInputCommentsList = (id) => async (dispatch) => {
  dispatch(commentsRequested())
  try {
    const { content } = await commentService.getInput(id)
    dispatch(commentsInputRecieved(content))
  } catch (error) {
    dispatch(commentsRequestFailed(error.message))
  }
}

export const createComment = (payload) => async (dispatch) => {
  const comment = {
    ...payload,
    _id: nanoid(),
    created_at: Date.now()
  }
  dispatch(commentCreateRequested())
  try {
    const { content } = await commentService.create(comment)
    dispatch(commentCreated(content))
  } catch (error) {
    console.log(error.message)
    dispatch(commentCreateFailed(error.message))
  }
}

export const removeComment = (id) => async (dispatch) => {
  dispatch(commentRemoveRequested())
  try {
    const { content } = await commentService.remove(id)
    if (content === null) dispatch(commentRemoved(id))
  } catch (error) {
    dispatch(commentRemoveFailed(error.message))
  }
}

export const getOutputComments = () => (state) => {
  return state.comments.entities.output
}
export const getInputComments = () => (state) => {
  return state.comments.entities.input
}
export const getCommentsLoading = () => (state) => state.comments.isLoading
export const getCommentById = (id) => (state) => {
  if (state.comments.entities) {
    const comments = state.comments.entities
    return comments.find((com) => com._id === id)
  }
  return []
}

export default commentsReducer

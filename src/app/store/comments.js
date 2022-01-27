import { createAction, createSlice } from "@reduxjs/toolkit"
import { nanoid } from "nanoid"
import commentService from "../services/comment.service"

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    entities: null,
    isLoading: true,
    error: null
  },
  reducers: {
    commentsRequested(state) {
      state.isLoading = true
    },
    commentsRecieved(state, action) {
      state.entities = action.payload
      state.isLoading = false
    },
    commentsRequestFailed(state, action) {
      state.error = action.payload
      state.isLoading = false
    },
    commentCreated(state, action) {
      state.entities.push(action.payload)
    },
    commentCreateFailed(state, action) {
      state.entities.error = action.payload
    },
    commentRemoved(state, action) {
      state.entities = state.entities.filter((c) => c._id !== action.payload)
      console.log("in reducer", state.entities)
    },
    commentRemoveFailed(state, action) {
      state.entities.error = action.payload
    }
  }
})

const { actions, reducer: commentsReducer } = commentsSlice
const {
  commentsRecieved,
  commentsRequestFailed,
  commentsRequested,
  commentCreated,
  commentRemoved,
  commentCreateFailed,
  commentRemoveFailed
} = actions

const commentCreateRequested = createAction("comments/commentCreateRequest")
const commentRemoveRequested = createAction("comments/commentRemoveRequest")

export const loadCommentsList = (pageId) => async (dispatch) => {
  dispatch(commentsRequested())
  try {
    const { content } = await commentService.get(pageId)
    dispatch(commentsRecieved(content))
  } catch (error) {
    dispatch(commentsRequestFailed(error.message))
  }
}

export const createComment = (payload) => async (dispatch, getState) => {
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

export const getComments = () => (state) => {
  return state.comments.entities
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

import React, { useContext, useEffect, useState } from "react"
import PropTypes from "prop-types"
import { toast } from "react-toastify"
import { nanoid } from "nanoid"
import { useParams } from "react-router-dom"
import commentService from "../services/comment.service"
import { useSelector } from "react-redux"
import { getCurrentUser } from "../store/users"

const CommentsContext = React.createContext()

export const useComments = () => {
  return useContext(CommentsContext)
}

export const CommentsProvider = ({ children }) => {
  const [isLoading, setLoading] = useState(true)
  const [comments, setComments] = useState([])
  const [error, setError] = useState(null)
  const { userId } = useParams()
  const currentUser = useSelector(getCurrentUser())

  function errorCatcher(error) {
    const { message } = error.response.data
    setError(message)
  }

  async function getComments() {
    try {
      const { content } = await commentService.get(userId)
      setComments(content)
    } catch (error) {
      errorCatcher(error)
    } finally {
      setLoading(false)
    }
  }

  async function createComment(data) {
    const comment = {
      ...data,
      _id: nanoid(),
      pageId: userId,
      userId: currentUser._id,
      created_at: Date.now()
    }

    try {
      const { content } = await commentService.create(comment)
      setComments((prev) => [...prev, content])
    } catch (error) {
      errorCatcher(error)
    }
  }

  async function removeComment(id) {
    try {
      const { content } = await commentService.remove(id)
      if (content === null) {
        setComments((prev) => prev.filter((item) => item._id !== id))
      }
    } catch (error) {
      errorCatcher(error)
    }
  }

  useEffect(() => {
    getComments()
  }, [userId])

  useEffect(() => {
    if (error !== null) {
      toast(error)
      setError(null)
    }
  }, [error])

  return (
    <CommentsContext.Provider
      value={{ isLoading, comments, createComment, removeComment }}
    >
      {children}
    </CommentsContext.Provider>
  )
}

CommentsProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
}

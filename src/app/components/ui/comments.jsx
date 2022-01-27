import { orderBy } from "lodash"
import React, { useEffect, useState } from "react"
import CommentsList, { AddCommentForm } from "../common/comments"
import { useDispatch, useSelector } from "react-redux"
import {
  createComment,
  getComments,
  getCommentsLoading,
  loadCommentsList,
  removeComment
} from "../../store/comments"
import { useParams } from "react-router-dom"
import { getAuthUser } from "../../store/users"

const Comments = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector(getCommentsLoading())
  const comments = useSelector(getComments())
  const { userId: pageId } = useParams()
  const currrentUserId = useSelector(getAuthUser())

  useEffect(() => {
    dispatch(loadCommentsList(pageId))
  }, [pageId])

  const handleSubmit = (data) => {
    dispatch(createComment({ ...data, pageId, userId: currrentUserId }))
  }

  const handleRemoveComment = (id) => {
    dispatch(removeComment(id))
  }

  const sortedComments = orderBy(comments, ["created_at"], ["desc"])

  return (
    <>
      <div className="card mb-2">
        <div className="card-body ">
          <AddCommentForm onSubmit={handleSubmit} />
        </div>
      </div>
      {sortedComments.length > 0 && (
        <div className="card mb-3">
          <div className="card-body ">
            <h2>Comments</h2>
            <hr />
            {!isLoading ? (
              <CommentsList
                comments={sortedComments}
                onRemove={handleRemoveComment}
              />
            ) : (
              "Loading..."
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Comments

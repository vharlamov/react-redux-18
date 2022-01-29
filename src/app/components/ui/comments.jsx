import { orderBy } from "lodash"
import React, { useEffect, useState } from "react"
import CommentsList, { AddCommentForm } from "../common/comments"
import { useDispatch, useSelector } from "react-redux"
import {
  createComment,
  getCommentsLoading,
  getInputComments,
  getOutputComments,
  loadInputCommentsList,
  loadOutputCommentsList,
  removeComment
} from "../../store/comments"
import { getAuthUser, getUsers } from "../../store/users"
import SelectField from "../common/form/selectField"
import { validator } from "../../utils/validator"

const Comments = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector(getCommentsLoading())
  const currentUserId = useSelector(getAuthUser())

  const [inputUserData, setInputUserData] = useState({ name: "", value: "" })
  const users = useSelector(getUsers())
  const usersList = users
    .map((u) => ({ label: u.name, name: u.name, value: u._id }))
    .filter((u) => u.value !== currentUserId)
  const outputComments = useSelector(getOutputComments())
  const inputComments = useSelector(getInputComments())
  const [comments, setComments] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    composeComments()
  }, [inputUserData, outputComments])

  function composeComments() {
    const id = inputUserData.value
    const recievedList = inputComments.filter((c) => c.outputId === id)
    const sendedList = outputComments.filter((c) => c.inputId === id)
    const sortedComments = orderBy(
      [...recievedList, ...sendedList],
      ["created_at"],
      ["desc"]
    )
    setComments(sortedComments)
  }

  //   const validatorConfig = {}
  //
  //   function validate(data) {
  //     const errors = validator(data, validatorConfig)
  //     setErrors(errors)
  //     return Object.keys(errors) === 0
  //   }

  function getInputUserName(id) {
    const name = usersList.find((u) => u.value === id).name
    return name
  }

  const handleChangeInputUser = ({ value }) => {
    const newData = { name: getInputUserName(value), value }
    console.log(errors.content)

    setInputUserData(newData)
  }

  useEffect(() => {
    dispatch(loadOutputCommentsList(currentUserId))
    dispatch(loadInputCommentsList(currentUserId))
  }, [])

  const handleSubmit = (data) => {
    // const isValid = validate(data)
    console.log("handleSubmit data", data)
    dispatch(
      createComment({
        ...data,
        inputId: inputUserData.value,
        outputId: currentUserId
      })
    )
  }

  const handleRemoveComment = (id) => {
    dispatch(removeComment(id))
  }

  return (
    <>
      <SelectField
        label="Выберите собеседника"
        defaultOption="Choose..."
        name="user"
        options={usersList}
        onChange={handleChangeInputUser}
        value={inputUserData.value}
      />
      <div className="card mb-2">
        <div className="card-body ">
          <AddCommentForm
            onSubmit={handleSubmit}
            isSelected={inputUserData.value}
          />
        </div>
      </div>
      {comments.length > 0 && (
        <div className="card mb-3">
          <div className="card-body ">
            <h2>Comments</h2>
            <hr />
            {!isLoading ? (
              <CommentsList
                comments={comments}
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

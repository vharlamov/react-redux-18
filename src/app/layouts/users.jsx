import React from "react"
import { useSelector } from "react-redux"
import { Redirect, useParams } from "react-router-dom"
import UsersLoader from "../components/hoc/usersLoader"
import EditUserPage from "../components/page/editUserPage"
import UserPage from "../components/page/userPage"
import UsersListPage from "../components/page/usersListPage"
import { getAuthUser } from "../store/users"

const Users = () => {
  const params = useParams()
  const { edit, userId } = params
  const currentUserId = useSelector(getAuthUser())

  return (
    <>
      <UsersLoader>
        {userId ? (
          edit ? (
            userId === currentUserId ? (
              <EditUserPage />
            ) : (
              <Redirect to={"/users"} />
            )
          ) : (
            <UserPage userId={userId} />
          )
        ) : (
          <UsersListPage />
        )}
      </UsersLoader>
    </>
  )
}

export default Users

import React, { useEffect } from "react"
import PropTypes from "prop-types"
import Quality from "./quality"
import { useSelector, useDispatch } from "react-redux"
import {
  getQualitiesByIds,
  getQualitiesLoading,
  loadQualitiesList
} from "../../../store/qualities"

const QualitiesList = ({ qualities }) => {
  const dispatch = useDispatch()
  const isLoading = useSelector(getQualitiesLoading())
  if (isLoading) return "Loadind ..."
  const qualitiesList = useSelector(getQualitiesByIds(qualities))

  useEffect(() => {
    dispatch(loadQualitiesList())
  }, [])

  return (
    <>
      {qualities
        ? qualitiesList.map((qual) => <Quality key={qual._id} {...qual} />)
        : []}
    </>
  )
}

QualitiesList.propTypes = {
  qualities: PropTypes.array
}

export default QualitiesList

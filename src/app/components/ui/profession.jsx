import React from "../../hooks/useProfession"
import PropTypes from "prop-types"
import { useSelector } from "react-redux"
import {
  getProfessionById,
  getProfessionsLoading
} from "../../store/professions"

const Profession = ({ id }) => {
  const prof = useSelector(getProfessionById(id))
  const isLoading = useSelector(getProfessionsLoading())
  if (!isLoading) {
    return <p>{prof.name}</p>
  } else return "loading ..."
}
Profession.propTypes = {
  id: PropTypes.string
}
export default Profession

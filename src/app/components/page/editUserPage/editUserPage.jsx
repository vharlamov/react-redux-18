import React, { useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import { validator } from "../../../utils/validator"
import api from "../../../api"
import TextField from "../../common/form/textField"
import SelectField from "../../common/form/selectField"
import RadioField from "../../common/form/radio.Field"
import MultiSelectField from "../../common/form/multiSelectField"
import BackHistoryButton from "../../common/backButton"
import { useProfessions } from "../../../hooks/useProfession"
import { useQualities } from "../../../hooks/useQualities"
import { useAuth } from "../../../hooks/useAuth"

const EditUserPage = () => {
  const user = useAuth().currentUser
  const { updateUser } = useAuth()
  const history = useHistory()
  const [data, setData] = useState(user)

  const { professions } = useProfessions()
  const professionsList = professions.map((item) => ({
    label: item.name,
    value: item._id
  }))

  const { qualities, isLoading } = useQualities()
  const qualitiesList = qualities.map((item) => ({
    label: item.name,
    value: item._id
  }))

  const transformData = (data) => {
    const qualSet = data.map((id) =>
      qualitiesList.find((qual) => qual.value === id)
    )
    return qualSet
  }

  useEffect(() => {
    if (!isLoading) {
      setData((prev) => ({
        ...prev,
        qualities: transformData(user.qualities)
      }))
    }
  }, [isLoading])

  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    const isValid = validate()

    if (!isValid) return

    const newData = {
      ...data,
      qualities: data.qualities.map((q) => q.value)
    }

    try {
      await updateUser(newData)
      history.push("/")
    } catch (error) {
      setErrors(error)
    }
  }

  const validatorConfig = {
    email: {
      isRequired: {
        message: "Электронная почта обязательна для заполнения"
      },
      isEmail: {
        message: "Email введен некорректно"
      }
    },
    name: {
      isRequired: {
        message: "Имя обязательно для заполнения"
      },
      min: {
        message: "Имя должно состоять минимум из 3 символов",
        value: 3
      }
    },
    profession: {
      isRequired: {
        message: "Обязательно выберите вашу профессию"
      }
    }
  }

  useEffect(() => validate(), [data])

  const handleChange = (target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value
    }))
  }

  const validate = () => {
    const errors = validator(data, validatorConfig)
    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  const isValid = Object.keys(errors).length === 0

  return (
    <div className="container mt-5">
      <BackHistoryButton />
      <div className="row">
        <div className="col-md-6 offset-md-3 shadow p-4">
          {!isLoading &&
          Object.keys(professions).length > 0 &&
          data.qualities[0].value ? (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Имя"
                name="name"
                value={data.name}
                onChange={handleChange}
                error={errors.name}
              />
              <TextField
                label="Электронная почта"
                name="email"
                value={data.email}
                onChange={handleChange}
                error={errors.email}
              />
              <SelectField
                label="Выбери свою профессию"
                defaultOption="Choose..."
                name="profession"
                options={professionsList}
                onChange={handleChange}
                value={data.profession}
                error={errors.profession}
              />
              <RadioField
                options={[
                  { name: "Male", value: "male" },
                  { name: "Female", value: "female" },
                  { name: "Other", value: "other" }
                ]}
                value={data.sex}
                name="sex"
                onChange={handleChange}
                label="Выберите ваш пол"
              />
              <MultiSelectField
                defaultValue={data.qualities}
                options={qualitiesList}
                onChange={handleChange}
                values
                name="qualities"
                label="Выберите ваши качества"
              />
              <button
                type="submit"
                disabled={!isValid}
                className="btn btn-primary w-100 mx-auto"
              >
                Обновить
              </button>
            </form>
          ) : (
            "Edit Loading..."
          )}
        </div>
      </div>
    </div>
  )
}

export default EditUserPage

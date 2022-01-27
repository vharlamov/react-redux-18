function generateAuthError(message) {
  switch (message) {
    case "INVALID_PASSWORD":
      return "Email или пароль введены неверно"
    case "EMAIL_EXISTS":
      return "Email уже существует"
    case "EMAIL_NOT_FOUND":
      return "Email не зарегистрирован"
    default:
      return "Слишком много попыток входа. Попробуйте войти позже"
  }
}

export default generateAuthError

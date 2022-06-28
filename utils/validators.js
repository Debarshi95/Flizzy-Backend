const validateRegister = ({
  name,
  email,
  password,
  phoneNumber,
  confirmPassword
}) => {
  const errors = {}

  if (!name || name.trim() === '') {
    errors.name = 'Name is required'
  }

  if (!email || email.trim() === '') {
    errors.email = 'Email is required'
  }

  if (!phoneNumber || phoneNumber.trim() === '') {
    errors.phoneNumber = 'Phone number is required'
  }

  if (!password || password.trim() === '') {
    errors.password = 'Password is required'
  }

  if (password.trim()?.length < 6) {
    errors.password = 'Password must have atleast six charaters'
  }

  if (
    !confirmPassword ||
    confirmPassword.trim() === '' ||
    password !== confirmPassword
  ) {
    errors.password = 'Passwords donot match'
  }
  return {
    errors,
    valid: !Object.keys(errors).length > 0
  }
}

const validateLogin = ({ email, password }) => {
  const errors = {}

  if (!email || email.trim() === '') {
    errors.email = 'Email is required'
  }

  if (!password || password.trim() === '') {
    errors.password = 'Password is required'
  }

  return {
    errors,
    valid: !Object.keys(errors).length > 0
  }
}

module.exports = {
  validateRegister,
  validateLogin
}

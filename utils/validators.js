const validateHR = ({
  name,
  email,
  phoneNumber,
  address,
  salary,
  password,
  designation
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

  if (!address || address.trim() === '') {
    errors.address = 'Address is required'
  }
  if (!password || password.trim() === '') {
    errors.password = 'Password is required'
  }
  if (!salary || salary.trim() === '') {
    errors.salary = 'Salary is required'
  }

  if (!designation || designation.trim() === '') {
    errors.designation = 'Designation is required'
  }

  return {
    errors,
    valid: !Object.keys(errors).length > 0
  }
}
const validateEmployee = ({
  name,
  email,
  phoneNumber,
  address,
  salary,
  designation
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

  if (!address || address.trim() === '') {
    errors.address = 'Address is required'
  }

  if (!salary || salary.trim() === '') {
    errors.salary = 'Salary is required'
  }

  if (!designation || designation.trim() === '') {
    errors.designation = 'Designation is required'
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
  validateHR,
  validateLogin,
  validateEmployee
}

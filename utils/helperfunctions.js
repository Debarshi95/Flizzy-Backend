const appendChar = (str, char) => {
  if (str === 'REJECT') {
    return `${str}ED`
  }
  if (str !== 'PENDING') {
    return `${str}${char}`
  }

  return str
}

module.exports = {
  appendChar
}

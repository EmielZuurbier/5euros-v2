const getPropertyByString = (object, string, separator = '.') => {
  const selector = string.split(separator)
  let value

  for (const key of selector) {
    value = value === undefined ? object?.[key] : value?.[key]
  }

  return value
}

export default getPropertyByString

/**
 * Returns an element with an error message inside of it.
 * @returns {HTMLElement}
 */
const createErrorElement = () => {
  const errorElement = document.createElement('div')
  errorElement.className = 'inner-error'

  const icon = document.createElement('i')
  icon.className = 'fas fa-dizzy'

  errorElement.append(icon)
  return errorElement
}

export default createErrorElement

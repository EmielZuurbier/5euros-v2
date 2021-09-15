/**
 * Creates a header element. Accepts a string for the title.
 * @param {string} text Text to put in the title
 * @returns HTMLElement
 */
const createHeaderElement = text => {
  const header = document.createElement('header')
  header.className = 'inner-header header-in'

  const title = document.createElement('h3')
  title.className = 'inner-title'
  title.textContent = text

  header.append(title)
  return header
}

export default createHeaderElement

export const innerElementTypes = {
  CATEGORY: 'category',
  DATA: 'data'
}

const innerElementTypeClasses = {
  category: 'has-cod-gray-color has-white-background-color',
  data: 'has-white-color has-cod-gray-background-color'
}

/**
 * Creates the inner structure for loader, images and title
 * @param {string} type data or category.
 * @returns {HTMLElement}
 */
const createInnerElement = type => {
  const inner = document.createElement('div')
  const selectedClass = innerElementTypeClasses[type]
  inner.className = `inner ${selectedClass}`
  return inner
}

export default createInnerElement

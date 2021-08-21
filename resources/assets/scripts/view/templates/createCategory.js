/**
 * Returns a category element.
 * @returns {HTMLElement}
 */
const createCategoryElement = id => {
  const categoryElement = document.createElement('euros-category')
  categoryElement.category = id

  return categoryElement
}

export default createCategoryElement

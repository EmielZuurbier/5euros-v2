/**
 * Returns a data element that holds an id and category id.
 * @param {object} args
 * @param {number} args.id
 * @param {number} args.categoryId
 * @returns {HTMLElement}
 */
const createDataElement = ({ id, categoryId }) => {
  const dataElement = document.createElement('euros-data')
  dataElement.id = id
  dataElement.category = categoryId

  return dataElement
}

export default createDataElement

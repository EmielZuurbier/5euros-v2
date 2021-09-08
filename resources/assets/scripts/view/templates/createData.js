/**
 * Returns a data element that holds an id and category id.
 * @param {object} args
 * @param {number} args.id
 * @param {number} args.category
 * @returns {HTMLElement}
 */
const createDataElement = ({ id, category }) => {
  const dataElement = document.createElement('euros-data')
  dataElement.id = id
  dataElement.category = category

  return dataElement
}

export default createDataElement

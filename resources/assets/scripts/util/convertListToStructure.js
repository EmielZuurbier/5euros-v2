/**
 * Changes the an array into an object where the keys are ids.
 * @param {array} list
 * @returns {object}
 */
const convertListToStructure = list =>
  list.reduce((object, listItem) => {
    const { id, items } = listItem

    if (listItem?.items) {
      listItem.items = convertListToStructure(items)
    }

    object[id] = listItem
    return object
  }, {})

export default convertListToStructure

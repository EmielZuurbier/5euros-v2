import {
  createAnimationElement,
  createCategoryElement,
  createDataElement,
  createHapticElement,
  createHeaderElement,
  createInnerElement,
  createLoaderElement
} from '@view/templates'
import { innerElementTypes } from '@view/templates/createInner'
import { createRandomDelay } from '@util'

/**
 * Renders all fragments based on the received data.
 * Returns a DocumentFragment instance to append to the DOM.
 * @param {array} list
 * @returns {DocumentFragment}
 */
export default list => {
  const documentFragment = new DocumentFragment()

  for (const { id, title, items } of list) {
    /**
     * Have each element enter the view with a different speed
     * @var {number}
     */
    const animationDelay = createRandomDelay()

    /**
     * Create a category element that supersedes the following items.
     */
    const categoryElement = createCategoryElement(id)
    const hapticElement = createHapticElement(50)
    const animationElement = createAnimationElement('data-in', animationDelay)
    const innerElement = createInnerElement(innerElementTypes.CATEGORY)
    const headerElement = createHeaderElement(title)

    /**
     * Store a reference early on so we don't have to query the innerElement
     * whenever the Intersection Observer triggers an event.
     */
    categoryElement.innerRef = innerElement

    /**
     * Category structure.
     */
    innerElement.append(headerElement)
    hapticElement.append(innerElement)
    animationElement.append(hapticElement)
    categoryElement.append(animationElement)

    /**
     * Append it to the fragment.
     */
    documentFragment.append(categoryElement)

    for (const { title, ...data } of Object.values(items)) {
      /**
       * Have each element enter the view with a different speed.
       * @var {number}
       */
      const animationDelay = createRandomDelay()

      /**
       * Create the initial structure
       */
      const dataElement = createDataElement(data)
      const animationElement = createAnimationElement('data-in', animationDelay)
      const hapticElement = createHapticElement(50)
      const innerElement = createInnerElement(innerElementTypes.DATA)
      const loaderElement = createLoaderElement()

      /**
       * Store a reference early on so we don't have to query the innerElement
       * whenever the Intersection Observer triggers an event.
       */
      dataElement.innerRef = innerElement

      /**
       * Data element structure.
       */
      innerElement.append(loaderElement)
      hapticElement.append(innerElement)
      animationElement.append(hapticElement)
      dataElement.append(animationElement)

      /**
       * Append it to the fragment.
       */
      documentFragment.append(dataElement)
    }
  }

  return documentFragment
}

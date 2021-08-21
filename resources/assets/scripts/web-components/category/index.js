/**
 * CategoryElement
 * @class
 */
export default class CategoryElement extends HTMLElement {
  /**
   * The HTMLElement container which holds loader, images and title.
   * Storing a reference saves us the hasle of querying it in a later stadium.
   * @var {HTMLElement}
   */
  #innerRef = null

  /**
   * @constructor
   */
  constructor() {
    super()
  }

  /**
   * Gets and sets the innerRef property value.
   */
  get innerRef() {
    return this.#innerRef
  }

  set innerRef(value) {
    if (value instanceof HTMLElement) {
      this.#innerRef = value
    }
  }

  /**
   * Returns and sets the category attribute value.
   */
  get category() {
    const value = Number(this.getAttribute('category'))
    if (!Number.isNaN(value)) {
      return value
    } else {
      return ''
    }
  }

  set category(value) {
    const numberValue = Number(value)
    if (!Number.isNaN(numberValue)) {
      this.setAttribute('category', numberValue)
    }
  }
}

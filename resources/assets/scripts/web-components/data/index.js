/**
 * DataElement
 * @class
 */
class DataElement extends HTMLElement {
  /**
   * The AudioBuffer that represents the audio
   * @var {AudioBuffer}
   */
  #buffer = null

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
   * Returns and sets the buffer property value.
   */
  get buffer() {
    return this.#buffer
  }

  set buffer(value) {
    if (value instanceof AudioBuffer) {
      this.#buffer = value
    }
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

  /**
   * Returns and sets the disabled attribute value.
   */
  get disabled() {
    return this.hasAttribute('disabled')
  }

  set disabled(value) {
    if (value === true) {
      this.setAttribute('disabled', '')
    } else {
      this.removeAttribute('disabled')
    }
  }

  /**
   * Returns and sets the loading attribute value.
   */
  get loading() {
    return this.hasAttribute('loading')
  }

  set loading(value) {
    if (value === true) {
      this.setAttribute('loading', '')
    } else {
      this.removeAttribute('loading')
    }
  }

  /**
   * Returns and sets the ready attribute value.
   */
  get ready() {
    return this.hasAttribute('ready')
  }

  set ready(value) {
    if (value === true) {
      this.setAttribute('ready', '')
    } else {
      this.removeAttribute('ready')
    }
  }

  /**
   * Returns and sets the playing attribute value.
   */
  get playing() {
    return this.hasAttribute('playing')
  }

  set playing(value) {
    if (value === true) {
      this.setAttribute('playing', '')
    } else {
      this.removeAttribute('playing')
    }
  }
}

export default DataElement

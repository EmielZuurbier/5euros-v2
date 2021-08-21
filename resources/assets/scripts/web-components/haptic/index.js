import html from './template.html'
import { supportsTouch } from '@util'

const template = document.createElement('template')
template.innerHTML = html

/**
 * An element that provides visual and haptic feedback on clicks.
 * @class
 */
class HapticElement extends HTMLElement {
  /**
   * Store a reference to the inner element.
   */
  #inner = null

  /**
   * @constructor
   */
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))
    this.#inner = this.inner
  }

  /**
   * Returns the inner element.
   */
  get inner() {
    return this.shadowRoot.querySelector('.inner')
  }

  /**
   * Gets and sets the duration value of the vibration attribute.
   */
  get duration() {
    const value = Number(this.getAttribute('duration'))
    if (!Number.isNaN(value)) {
      return value
    } else {
      return 0
    }
  }

  set duration(value) {
    const numberValue = Number(value)
    if (!Number.isNaN(numberValue)) {
      this.setAttribute('duration', numberValue)
    }
  }

  /**
   * Start listening for touch or click events.
   * @method connectedCallback
   * @returns	{void}
   */
  connectedCallback() {
    if (navigator.vibrate) {
      if (supportsTouch()) {
        this.addEventListener('touchstart', this.vibrate)
        this.addEventListener('touchstart', this.onInteractionStart)
        this.addEventListener('touchend', this.onInteractionEnd)
      } else {
        this.addEventListener('click', this.vibrate)
        this.addEventListener('mousedown', this.onInteractionStart)
        this.addEventListener('mouseup', this.onInteractionEnd)
      }
    }
  }

  /**
   * Remove the touch or click events
   * @method disconnectedCallback
   * @returns {void}
   */
  disconnectedCallback() {
    if (navigator.vibrate) {
      if (supportsTouch()) {
        this.removeEventListener('touchstart', this.vibrate)
        this.removeEventListener('touchstart', this.onInteractionStart)
        this.removeEventListener('touchend', this.onInteractionEnd)
      } else {
        this.removeEventListener('click', this.vibrate)
        this.removeEventListener('mousedown', this.onInteractionStart)
        this.removeEventListener('mouseup', this.onInteractionEnd)
      }
    }
  }

  /**
   * Calculate the transformation based on the clicked position on the element.
   * @param {Event} event
   */
  onInteractionStart = event => {
    const { left, top, width, height } = this.getBoundingClientRect()

    /**
     * The x and y position on the client.
     * Should either be gotten from the touch or click event.
     */
    let client
    if (event.touches) {
      const touch = event.touches[0]

      client = {
        x: touch.clientX,
        y: touch.clientY
      }
    } else {
      client = {
        x: event.clientX,
        y: event.clientY
      }
    }

    /**
     * Calculated pointer position.
     */
    const positions = {
      x: client.x - left,
      y: client.y - top
    }

    /**
     * Calculate the center of the element.
     */
    const center = {
      x: Math.round(width / 2),
      y: Math.round(height / 2)
    }

    /**
     * Subtract the center from the clicked position.
     * This wil place the 0, 0 point in the center of the element.
     */
    const corrections = {
      x: positions.x - center.x,
      y: positions.y - center.y
    }

    /**
     * Calculate the percentages moved from the center point.
     * The center being 0%, the edges 100%.
     */
    const percentages = {
      x: (corrections.x / center.x) * 100,
      y: (corrections.y / center.y) * 100
    }

    /**
     * The amount of compensation put on the rotation.
     * This number will decrease the rate of rotation by division.
     */
    const compensation = 98

    /**
     * The calculated rotations.
     */
    const rotations = {
      x: -percentages.y / compensation,
      y: percentages.x / compensation
    }

    /**
     * Translation in the z-axis.
     */
    const zTranslation = -2

    /**
     * Set transform.
     */
    this.#inner.style.transform = `rotateX(${rotations.x}deg) rotateY(${rotations.y}deg) translateZ(${zTranslation}px)`
  }

  /**
   * Reset the transformation on the element.
   */
  onInteractionEnd = () => {
    this.#inner.style.transform = `rotateX(0deg) rotateY(0deg) translateZ(0px)`
  }

  /**
   * Vibrate with the given duration
   */
  vibrate = () => {
    navigator.vibrate(this.duration)
  }
}

export default HapticElement

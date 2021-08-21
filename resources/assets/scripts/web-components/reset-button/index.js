import { dataStore } from '@data/store'

export default class ResetButtonElement extends HTMLElement {
  constructor() {
    super()
  }

  /**
   * Add the event listeners and store subscription.
   */
  connectedCallback() {
    this.addEventListener('click', this.resetFragments)
  }

  /**
   * Remove the event listeners.
   */
  disconnectedCallback() {
    this.removeEventListener('click', this.resetFragments)
  }

  /**
   * Get the data from the server.
   */
  resetFragments = event => {
    dataStore.dispatch('list', 'getFragments')
    event.preventDefault()
  }
}

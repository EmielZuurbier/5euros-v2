import { dataStore, settingsStore } from '@data/store'

export default class SearchPanelElement extends HTMLElement {
  static get observedAttributes() {
    return ['active']
  }

  constructor() {
    super()
  }

  // Gets and sets the active attribute
  get active() {
    const value = this.getAttribute('active')
    return value === null ? false : value
  }

  set active(value) {
    if (value === true) {
      this.setAttribute('active', '')
    } else {
      this.removeAttribute('active')
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === '') {
      const input = this.querySelector('input')
      input.focus()
    }
  }

  /**
   * Add the event listeners and store subscription.
   */
  connectedCallback() {
    this.addEventListener('submit', this.onSubmit)
    this.addEventListener('formdata', this.onFormData)

    settingsStore.events.subscribe('searchPanelChange', this.onStateChange)
  }

  /**
   * Remove the event listeners.
   */
  disconnectedCallback() {
    this.removeEventListener('submit', this.onSubmit)
    this.removeEventListener('formdata', this.onFormData)

    settingsStore.events.unSubscribe('searchPanelChange', this.onStateChange)
  }

  /**
   *
   * @param {Event} event
   */
  onSubmit = event => {
    new FormData(event.target)
    event.preventDefault()
  }

  /**
   *
   * @param {Event} event
   */
  onFormData = ({ formData }) => {
    const query = formData.get('query')
    dataStore.dispatch('list', 'searchFragments', query)
  }

  /**
   * Update the state of the element.
   * @param {object} state
   */
  onStateChange = ({ opened }) => {
    this.active = opened
  }
}

import { settingsStore } from '@data/store'

export default class SearchButtonElement extends HTMLElement {
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

  /**
   * Add the event listeners and store subscription.
   */
  connectedCallback() {
    this.addEventListener('click', this.toggleSearchPanelOpened)
    settingsStore.events.subscribe('searchPanelChange', this.onStateChange)
  }

  /**
   * Remove the event listeners.
   */
  disconnectedCallback() {
    this.removeEventListener('click', this.toggleSearchPanelOpened)
    settingsStore.events.unSubscribe('searchPanelChange', this.onStateChange)
  }

  /**
   * Set active state on state change.
   * @param {Event} event
   */
  onStateChange = ({ opened }) => {
    this.active = opened
  }

  /**
   * Checks the current crazy mode value and toggles it.
   * Then dispatches it to the store.
   */
  toggleSearchPanelOpened = () => {
    const isActive = settingsStore.states.searchPanel.opened
    const payload = !isActive
    settingsStore.dispatch('searchPanel', 'setSearchPanelOpened', payload)
  }
}

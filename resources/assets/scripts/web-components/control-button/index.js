import { settingsStore } from '@data/store'

export default class ControlButtonElement extends HTMLElement {
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
    this.addEventListener('click', this.toggleCrazyMode)

    settingsStore.events.subscribe('controlPanelChange', ({ opened }) => {
      this.active = opened
    })
  }

  /**
   * Remove the event listeners.
   */
  disconnectedCallback() {
    this.removeEventListener('click', this.toggleCrazyMode)
  }

  /**
   * Checks the current crazy mode value and toggles it.
   * Then dispatches it to the store.
   */
  toggleCrazyMode = () => {
    const isActive = settingsStore.states.controlPanel.opened
    const payload = !isActive
    settingsStore.dispatch('controlPanel', 'setControlPanelOpened', payload)
  }
}

import { settingsStore, effectsStore } from '@data/store'

export default class ControlPanelElement extends HTMLElement {
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
    settingsStore.events.subscribe('controlPanelChange', this.onStateChange)
    this.addEventListener('change', this.onChange)
  }

  /**
   * Remove the event listeners.
   */
  disconnectedCallback() {
    settingsStore.events.unSubscribe('controlPanelChange', this.onStateChange)
    this.removeEventListener('change', this.onChange)
  }

  /**
   * Update the state of the element.
   * @param {object} state
   */
  onStateChange = ({ opened }) => {
    this.active = opened

    /**
     * Reset scroll position to top.
     */
    if (opened === true) {
      this.scrollTop = 0
    }
  }

  /**
   * Listens to all change events inside the panel and updates the store.
   * NOTE: Although input is favourable, it triggers to many state updates.
   * FIXME: Add a debounce functionality.
   * @param {Event} event
   */
  onChange = ({ target }) => {
    const { name, value, type, checked } = target
    let payload

    const [store, prop] = name.split('.')

    if (type === 'checkbox') {
      payload = { name: prop, value: checked }
    } else {
      payload = { name: prop, value }
    }

    effectsStore.dispatch(store, 'setEffect', payload)
  }
}

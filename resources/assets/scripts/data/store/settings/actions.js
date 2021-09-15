export default {
  /**
   * Set the crazy mode active state.
   * @param {string} stateKey The key of the state to update.
   * @param {Store} context
   * @param {boolean} payload
   */
  setCrazyMode(stateKey, context, payload) {
    context.commit(stateKey, 'setCrazyMode', payload)
  },

  /**
   * Set the control panel opened state.
   * @param {string} stateKey The key of the state to update.
   * @param {Store} context
   * @param {boolean} payload
   */
  setControlPanelOpened(stateKey, context, payload) {
    context.commit(stateKey, 'setControlPanelOpened', payload)
  },

  /**
   * Set the search panel opened state.
   * @param {string} stateKey The key of the state to update.
   * @param {Store} context
   * @param {boolean} payload
   */
  setSearchPanelOpened(stateKey, context, payload) {
    context.commit(stateKey, 'setSearchPanelOpened', payload)
  }
}

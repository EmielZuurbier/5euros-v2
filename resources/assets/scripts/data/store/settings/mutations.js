export default {
  setCrazyMode(state, payload) {
    return {
      ...state,
      active: payload
    }
  },
  setControlPanelOpened(state, payload) {
    return {
      ...state,
      opened: payload
    }
  },
  setSearchPanelOpened(state, payload) {
    return {
      ...state,
      opened: payload
    }
  }
}

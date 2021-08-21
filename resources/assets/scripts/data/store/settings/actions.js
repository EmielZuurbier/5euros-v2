export default {
  setCrazyMode(context, payload) {
    context.commit('setCrazyMode', payload)
  },
  setControlPanelOpened(context, payload) {
    context.commit('setControlPanelOpened', payload)
  },
  setSearchPanelOpened(context, payload) {
    context.commit('setSearchPanelOpened', payload)
  }
}

export default {
  setEffect(state, payload) {
    const { name, value } = payload

    return {
      ...state,
      [name]: value
    }
  }
}

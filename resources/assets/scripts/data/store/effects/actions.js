export default {
  setEffect(context, payload) {
    const { name, value } = payload

    let stateValue

    if (typeof value === 'boolean') {
      stateValue = !value
    } else {
      stateValue = Number(value)
    }

    context.commit('setEffect', {
      name,
      value: stateValue
    })
  }
}

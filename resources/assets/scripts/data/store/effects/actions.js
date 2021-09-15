export default {
  setEffect(stateKey, context, payload) {
    const { name, value } = payload

    let stateValue

    if (typeof value === 'boolean') {
      stateValue = !value
    } else {
      stateValue = Number(value)
    }

    context.commit(stateKey, 'setEffect', {
      name,
      value: stateValue
    })
  }
}

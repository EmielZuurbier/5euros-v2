export default class PubSub {
  constructor() {
    this.events = {}
  }

  subscribe(event, callback) {
    if (!this.events?.[event]) {
      this.events[event] = []
    }

    return this.events[event].push(callback)
  }

  unSubscribe(event, callback) {
    if (!this.events?.[event]) {
      return
    }

    const index = this.events[event].indexOf(callback)
    if (index > -1) {
      this.events[event].splice(index, 1)
    }

    return this.events[event]
  }

  publish(event, data = {}) {
    if (!this.events?.[event]) {
      return []
    }

    return this.events[event].forEach(callback => callback(data))
  }
}

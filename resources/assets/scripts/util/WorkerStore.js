export default class WorkerStore {
  /**
   * The worker reference.
   */
  #worker = null

  /**
   * Store the
   */
  #actions = []

  /**
   * Create a
   * @param {string} workerPath Path to worker.js file.
   */
  constructor(workerPath) {
    this.#worker = new Worker(workerPath)
    this.#worker.addEventListener('message', ({ data }) => {
      const { action, payload } = data
      this.publish(action, payload)
    })
  }

  /**
   * Send data with an action and payload to the worker.
   * @param {string} action
   * @param {any} payload
   */
  dispatch(action, payload) {
    this.#worker.postMessage({
      action,
      payload
    })
  }

  /**
   * Listen to a certain action of the worker
   * @param {string} action
   * @param {function} callback
   * @returns {array}
   */
  subscribe(action, callback) {
    if (!this.#actions?.[action]) {
      this.#actions[action] = []
    }

    return this.#actions[action].push(callback)
  }

  /**
   * Call the callbacks for this action.
   * @param {string} action
   * @param {any} data
   * @returns {array}
   */
  publish(action, data = {}) {
    if (!this.#actions?.[action]) {
      return []
    }

    return this.#actions[action].map(callback => callback(data))
  }
}

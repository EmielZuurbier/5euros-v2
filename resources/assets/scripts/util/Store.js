import PubSub from './PubSub'

/**
 * Store implementation with a subscribe, dispatch and etc. functionalities.
 * Derived from the link here below.
 * @link https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/
 */
export default class Store {
  static status = {
    DEFAULT: 'default state',
    RESTING: 'resting',
    ACTION: 'action',
    MUTATION: 'mutation'
  }

  /**
   * The states should not be muted directly and are therefor we store
   * the states in a private object.
   */
  #states = {}

  /**
   * Creates a Proxy for the state.
   * This allows the store to notify whenever a specific state has been modified.
   * @param {string} name
   * @param {object} initialState
   * @returns {Proxy}
   */
  #createState = (name, initialState) =>
    new Proxy(initialState, {
      set: (state, key, value) => {
        Reflect.set(state, key, value)

        const changeEvent = `${name}Change`
        console.debug(`${changeEvent}: ${key}`, value)
        this.events.publish(`${changeEvent}`, state)

        this.status = Store.status.RESTING

        return true
      }
    })

  constructor(name, { actions, mutations, states }) {
    this.name = name
    this.actions = {}
    this.mutations = {}
    this.status = Store.status.DEFAULT
    this.events = new PubSub()

    if (actions) {
      this.actions = actions
    }

    if (mutations) {
      this.mutations = mutations
    }

    if (states) {
      this.states = states
    }
  }

  /**
   * Returns the states object.
   * Return a copy of the states to prevent any mutations being made directly
   * to the state.
   */
  get states() {
    return this.#states
  }

  /**
   * Loops over an array of states and creates a Proxy for each of them
   * to notify the user whenever that particular state has been changed.
   */
  set states(states) {
    states.forEach(({ name, state }) => {
      this.#states[name] = this.#createState(name, state)
    })
  }

  dispatch(stateKey, actionKey, payload) {
    if (typeof this.actions[actionKey] !== 'function') {
      console.error(`Action "${actionKey} doesn't exist.`)
      return false
    }

    if (typeof this.#states[stateKey] === 'undefined') {
      console.error(`State "${stateKey} doesn't exist.`)
      return false
    }

    // console.groupCollapsed(`ACTION: ${actionKey}`)
    this.status = Store.status.ACTION
    const action = this.actions[actionKey]
    action(stateKey, this, payload)
    // console.groupEnd()

    return true
  }

  commit(stateKey, mutationKey, payload) {
    if (typeof this.mutations[mutationKey] !== 'function') {
      console.log(`Mutation "${mutationKey}" doesn't exist`)
      return false
    }

    this.status = Store.status.MUTATION
    const mutation = this.mutations[mutationKey]

    const currentState = this.#states[stateKey]
    const newState = mutation(currentState, payload)

    this.#states[stateKey] = Object.assign(currentState, newState)

    return true
  }
}

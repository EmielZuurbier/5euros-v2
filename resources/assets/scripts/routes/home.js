import { dataStore } from '@data/store'

export default {
  name: 'home',
  path: '/',
  events: {
    init() {
      /**
       * Get the data from the server.
       */
      dataStore.dispatch('list', 'getFragments')
    },

    finalize() {}
  }
}

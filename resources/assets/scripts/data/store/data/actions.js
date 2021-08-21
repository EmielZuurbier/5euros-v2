import { getData } from '@api'
import { convertListToStructure } from '@util'

export default {
  /**
   * Fetches all fragments from the REST API.
   * @param {Store} context
   */
  async getFragments(context) {
    const url = new URL(window.__appData__.endpoints.data)
    const nonce = window.__appData__.nonce

    /**
     * Try to get the data from the API.
     */
    try {
      const list = await getData({
        url,
        nonce
      })

      /**
       * Update the data property.
       */
      context.commit('setData', list)
    } catch (error) {
      console.log(error)
    }
  },

  /**
   * Searches for specific fragments based on a query.
   * @param {Store} context The dataStore instance.
   * @param {string} payload The string to query
   */
  async searchFragments(context, payload) {
    const query = payload.replace(/ /g, ',').toLowerCase()

    const url = new URL(`${window.__appData__.endpoints.search}/${query}`)
    const nonce = window.__appData__.nonce

    /**
     * Try to get the data from the API.
     */
    try {
      const list = await getData({
        url,
        nonce
      })

      /**
       * Update the data property.
       */
      context.commit('setData', list)
    } catch (error) {
      console.log(error)
    }
  },

  /**
   * Convert the array of fragments to an object where the keys are ids
   * and the values the categories.
   * @param {Store} context
   * @param {array} payload
   */
  structureFragments(context, payload) {
    const structure = convertListToStructure(payload)
    context.commit('setData', structure)
  },

  /**
   * Stores the URL which references the Blob of the image.
   * @param {Store} context The dataStore instance
   * @param {object} payload An id of a dataElement and the src of an image.
   */
  setCache(context, payload) {
    context.commit('setCache', payload)
  },

  /**
   * Revokes all object URLs in the store and clean the state.
   * @param {Store} context The dataStore instance.
   */
  clearObjectURLs(context) {
    context.commit('clearObjectURLs')
  }
}

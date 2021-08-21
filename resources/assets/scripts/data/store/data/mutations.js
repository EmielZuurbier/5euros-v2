export default {
  setData(state, payload) {
    return {
      ...state,
      data: payload
    }
  },

  /**
   * Returns a new state with a key added.
   * @param {object} state The current state
   * @param {object} payload An id and a string
   * @returns {object}
   */
  setCache(state, payload) {
    const { id, src, buffer } = payload

    return {
      ...state,
      data: {
        ...state.data,
        [id]: {
          src,
          buffer
        }
      }
    }
  },

  /**
   * Revoke all object URLs and return a clean state.
   * @param {object} state The current state.
   * @returns {object}
   */
  clearObjectURLs(state) {
    const { data } = state

    for (const { src } of Object.values(data)) {
      URL.revokeObjectURL(src)
    }

    return {
      data: {}
    }
  }
}

class AjaxError extends Error {
  /**
   * @param {string} message
   * @param {Response} response
   */
  constructor(message, response) {
    super(message)
    this.name = 'AjaxError'
    this.response = response
  }

  /**
   * Returns the status code from the Response instance.
   * @returns {string} The response status code
   */
  getResponseStatus() {
    return this.response.status
  }

  /**
   * Returns the response message from the Response instance.
   * @returns {string} The response message
   */
  getResponseMessage() {
    return this.response.statusText
  }

  toString() {
    const status = this.getResponseStatus()
    const message = this.getResponseMessage()
    return `${status} | ${message}`
  }
}

export default AjaxError

import { AjaxError } from '@api/util'

/**
 * Basic request wrapper for handling fetch and errors.
 * @param {string|URL} resource Resource to send a request to.
 * @param {RequestInit} options Options for the fetch request
 * @returns {Promise<Response|AjaxError>}
 */
const ajaxRequest = async (resource, options = {}) => {
  const response = await fetch(resource, options)

  if (!response.ok) {
    throw new AjaxError('fetch blob', 'Something went wrong', response)
  }

  return response
}

export default ajaxRequest

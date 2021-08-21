import { ajaxRequest } from '@api/util'

/**
 * Sends a request and returns a ArrayBuffer when successful.
 * @param {URL|string} resource
 * @returns {Promise<Blob|AjaxError>}
 */
const fetchArrayBuffer = async resource => {
  const response = await ajaxRequest(resource)
  const blob = await response.arrayBuffer()
  return blob
}

export default fetchArrayBuffer

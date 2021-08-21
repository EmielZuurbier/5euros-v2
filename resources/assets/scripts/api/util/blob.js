import { ajaxRequest } from '@api/util'

/**
 * Sends a request and returns a Blob when successful.
 * @param {URL|string} resource
 * @returns {Promise<Blob|AjaxError>}
 */
const fetchBlob = async resource => {
  const response = await ajaxRequest(resource)
  const blob = await response.blob()
  return blob
}

export default fetchBlob

import { ajaxRequest } from './util'

/**
 * Basic
 * @param {object} args
 * @param {string} url
 * @param {string} nonce
 * @returns {Promise<string|AjaxError>}
 */
const getData = async ({ url, nonce }) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'X-WP-Nonce': nonce
  })

  const response = await ajaxRequest(url, {
    headers
  })

  return response.json()
}

export default getData

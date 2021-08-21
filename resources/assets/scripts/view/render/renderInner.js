import { dataStore } from '@data/store'
import { decodeAudioData } from '@audio'
import {
  createHeaderElement,
  createThumbnailElement,
  createErrorElement
} from '@view/templates'

/**
 * Renders the inner guts of a euros-data element.
 * @param {} param0
 * @returns
 */
const renderInner = async ({ arrayBuffer, blob, id, title }) => {
  /**
   * Get the data element.
   */
  const dataElement = document.getElementById(id)
  if (dataElement === null) {
    return
  }

  try {
    let buffer
    let src

    /**
     * Check if the dataCache have already been used and stored.
     * If so, then reuse them again.
     */
    if (typeof dataStore.states?.dataCache?.data?.[id] !== 'undefined') {
      const { buffer: storedBuffer, src: storedSrc } =
        dataStore.states.dataCache.data[id]

      buffer = storedBuffer
      src = storedSrc

      /**
       * Otherwise create the object URLS
       */
    } else {
      /**
       * Try to decode the buffer and set it to the data element.
       * If this goes wrong, then an error element will be appended.
       *
       * NOTE: It would be really cool if we could load the worker with this function, but the AudioContext
       * is not available in a worker scope, at the moment.
       */
      buffer = await decodeAudioData(arrayBuffer)

      /**
       * Create a link to the Blob so we can use it as an image.
       */
      src = URL.createObjectURL(blob)

      /**
       * Save the objectURLs to the store.
       * By saving a reference we can later call URL.revokeObjectURL to clear the asset from memory.
       */
      dataStore.dispatch('dataCache', 'setCache', {
        id,
        src,
        buffer
      })
    }

    /**
     * Set the buffer.
     */
    dataElement.buffer = buffer

    /**
     * Create a header and thumbnail
     */
    const header = createHeaderElement(title)
    const thumbnail = createThumbnailElement(src)

    /**
     * Append the thumbnail and header to the dataElement's inner.
     */
    requestAnimationFrame(() => {
      dataElement.innerRef.append(thumbnail, header)
      dataElement.loading = false
      dataElement.ready = true
    })
  } catch (error) {
    console.log(error)

    dataElement.loading = false
    dataElement.disabled = true

    /**
     * Create an error element and append that instead.
     */
    const errorElement = createErrorElement()

    requestAnimationFrame(() => {
      dataElement.innerRef.append(errorElement)
    })
  }
}

export default renderInner

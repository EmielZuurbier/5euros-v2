import { fetchArrayBuffer, fetchBlob } from './util'

/**
 * Download both the audio and the image.
 * @param {*} data
 * @returns {Promise<{buffer, blob, id, title}>}
 */
const getFragmentData = async data => {
  const { audio, thumbnail, id, title } = data

  const audioPromise = fetchArrayBuffer(audio.url)
  const imagePromise = fetchBlob(thumbnail['@1x'])

  const results = await Promise.allSettled([audioPromise, imagePromise])
  const [arrayBuffer, blob] = results.map(({ value }) => value)

  return {
    arrayBuffer,
    blob,
    id,
    title
  }
}

export default getFragmentData

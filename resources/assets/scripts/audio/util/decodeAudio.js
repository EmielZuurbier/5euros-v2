import { audioContext } from '@audio'

/**
 * Accepts an ArrayBuffer and decodes it to a playable bufffer with the Web Audio API.
 * @param {ArrayBuffer} arrayBuffer
 * @returns {Promise<decodedAudioData>}
 */
const decodeAudioData = arrayBuffer =>
  new Promise((resolve, reject) => {
    const onSuccess = buffer => resolve(buffer)
    const onError = error => reject(error)

    audioContext.decodeAudioData(arrayBuffer, onSuccess, onError)
  })

export default decodeAudioData

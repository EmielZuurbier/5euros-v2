/**
 * An AudioBufferSourceNode that plays the audio.
 * Only has an output to connect to other AudioNodes
 */
export default class Player {
  /**
   * Store the context
   */
  #context = null

  /**
   * Create the AudioBufferSourceNode and set the buffer.
   * @param {BaseAudioContext} context
   * @param {AudioBuffer} buffer
   * @param {() => {}} onEnded
   */
  constructor(context, buffer, onEnded) {
    this.output = context.createBufferSource()
    this.output.buffer = buffer
    this.output.addEventListener('ended', onEnded)
    this.#context = context
  }

  /**
   * Sets the playback rate.
   * @param {number} value
   */
  set speed(value = 1) {
    if (value >= 0) {
      this.output.playbackRate.value = value
    }
  }

  /**
   * Connect the output to a destination.
   * @param {AudioNode} dest
   */
  connect(dest) {
    this.output.connect(dest.input ? dest.input : dest)
  }

  /**
   * Disconnect the output.
   */
  disconnect() {
    this.output.disconnect()
  }

  /**
   * Start playing the AudioBufferSourceNode.
   */
  start() {
    this.output.start(this.#context.currentTime)
  }

  /**
   * Stop the AudioBufferSourceNode.
   */
  stop() {
    this.output.stop(0)
  }
}

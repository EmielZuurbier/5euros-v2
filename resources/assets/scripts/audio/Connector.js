/**
 * A simple GainNode which acts as a connector between other AudioNodes
 */
export default class Connector {
  /**
   * @param {BaseAudioContext} context
   */
  constructor(context) {
    const gain = context.createGain()
    this.input = gain
    this.output = gain
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
}

export default class BitCrusher {
  static get meta() {
    return {
      name: 'Bitcrusher',
      params: {
        bitDepth: {
          min: 1,
          max: 16,
          defaultValue: 3,
          type: 'float'
        },
        frequencyReduction: {
          min: 0,
          max: 1,
          defaultValue: 0.1,
          type: 'float'
        }
      }
    }
  }

  /**
   * State of the bypass.
   */
  #bypass = false

  /**
   * Store the worklet.
   */
  #worklet = null

  /**
   * Store the AudioParams
   */
  #bitDepth
  #frequencyReduction

  /**
   * @typedef {object} BitCrusherArgs
   * @property {number} bitDepth
   * @property {number} frequencyReduction
   */

  /**
   * @param {AudioContext} context
   * @param {BitCrusherArgs} args
   */
  constructor(context, { bypass, bitDepth, frequencyReduction }) {
    this.input = context.createGain()
    this.output = context.createGain()
    this.#worklet = new AudioWorkletNode(context, 'bit-crusher-processor')

    /**
     * @type {AudioParam}
     */
    this.#bitDepth = this.#worklet.parameters.get('bitDepth')

    /**
     * @type {AudioParam}
     */
    this.#frequencyReduction =
      this.#worklet.parameters.get('frequencyReduction')

    const { params } = BitCrusher.meta

    this.bitDepth = bitDepth || params.bitDepth.defaultValue
    this.frequencyReduction =
      frequencyReduction || params.frequencyReduction.defaultValue

    this.input.connect(this.#worklet)
    this.#worklet.connect(this.output)

    this.bypass = bypass
  }

  get bitDepth() {
    return this.#bitDepth.value
  }

  set bitDepth(value) {
    this.#bitDepth.value = value
  }

  get frequencyReduction() {
    return this.#frequencyReduction.value
  }

  set frequencyReduction(value) {
    this.#frequencyReduction.value = value
  }

  /**
   * When true the effect will not be connected.
   */
  get bypass() {
    return this.#bypass
  }

  set bypass(value) {
    if (value === true && this.#bypass === false) {
      this.input.disconnect(this.#worklet)
      this.input.connect(this.output)
      this.#bypass = true
    } else if (value === false && this.#bypass === true) {
      this.input.disconnect(this.output)
      this.input.connect(this.#worklet)
      this.#bypass = false
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
}

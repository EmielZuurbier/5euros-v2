export default class Reverb {
  static get meta() {
    return {
      name: 'Reverb',
      params: {
        seconds: {
          min: 1,
          max: 50,
          defaultValue: 3,
          type: 'float'
        },
        decay: {
          min: 0,
          max: 100,
          defaultValue: 2,
          type: 'float'
        },
        reverse: {
          min: 0,
          max: 1,
          defaultValue: 0,
          type: 'bool'
        }
      }
    }
  }

  /**
   * Store the context
   */
  #context = null

  /**
   * State of the bypass.
   */
  #bypass = false

  /**
   * Store the ConvolverNode.
   */
  #convolver = null

  /**
   * Define the private fields.
   */
  #seconds = 3
  #decay = 2
  #reverse = 0

  /**
   * Utility function for building an impulse response
   * from the module parameters.
   */
  #buildImpulse() {
    const rate = this.#context.sampleRate
    const length = rate * this.seconds
    const decay = this.decay
    const impulse = this.#context.createBuffer(2, length, rate)
    const impulseL = impulse.getChannelData(0)
    const impulseR = impulse.getChannelData(1)
    let n

    for (let i = 0; i < length; i++) {
      n = this.reverse ? length - i : i
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay)
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay)
    }

    this.#convolver.buffer = impulse
  }

  /**
   * @typedef {object} ReverbArgs
   * @property {number} seconds
   * @property {number} decay
   * @property {boolean} reverse
   */

  /**
   * @param {AudioContext} context
   * @param {ReverbArgs} args
   */
  constructor(context, { bypass, seconds, decay, reverse }) {
    this.#context = context
    this.#convolver = context.createConvolver()
    this.input = context.createGain()
    this.output = context.createGain()

    /**
     * Connect the input to both the convolver and the output.
     * This way we will get a combination of a clean sound with a reverb that runs parallel.
     *
     *           bypass
     * -- input -------- output --
     *     \__ convolver __/
     *
     */
    this.input.connect(this.output)
    this.input.connect(this.#convolver)
    this.#convolver.connect(this.output)

    this.bypass = bypass

    const { params } = Reverb.meta

    this.#seconds = seconds || params.seconds.defaultValue
    this.#decay = decay || params.decay.defaultValue
    this.#reverse = reverse || params.reverse.defaultValue
    this.#buildImpulse()
  }

  /**
   * Gets and sets the seconds param.
   */
  get seconds() {
    return this.#seconds
  }

  set seconds(value) {
    if (this.#seconds !== value) {
      this.#seconds = value
      this.#buildImpulse()
    }
  }

  /**
   * Gets and sets the decay param.
   */
  get decay() {
    return this.#decay
  }

  set decay(value) {
    if (this.#decay !== value) {
      this.#decay = value
      this.#buildImpulse()
    }
  }

  /**
   * Gets and sets the reverse param.
   */
  get reverse() {
    return this.#reverse
  }

  set reverse(value) {
    if (this.#reverse !== value) {
      this.#reverse = value
      this.#buildImpulse()
    }
  }

  /**
   * When true the effect will not be connected.
   */
  get bypass() {
    return this.#bypass
  }

  set bypass(value) {
    if (value === true && this.#bypass === false) {
      this.input.disconnect(this.#convolver)
      this.#bypass = true
    } else if (value === false && this.#bypass === true) {
      this.input.connect(this.#convolver)
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

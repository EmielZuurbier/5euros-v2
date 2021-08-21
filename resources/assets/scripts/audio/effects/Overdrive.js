export default class Overdrive {
  static meta() {
    return {
      name: 'Overdrive',
      params: {
        preBand: {
          min: 0,
          max: 1.0,
          defaultValue: 0.5,
          type: 'float'
        },
        color: {
          min: 0,
          max: 22050,
          defaultValue: 800,
          type: 'float'
        },
        drive: {
          min: 0.0,
          max: 1.0,
          defaultValue: 0.5,
          type: 'float'
        },
        postCut: {
          min: 0,
          max: 22050,
          defaultValue: 3000,
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
   * Define private effect properties.
   */
  #bandpass
  #bpWet
  #bpDry
  #ws
  #lowpass
  #drive

  /**
   * Overdrive effect module for the Web Audio API.
   *
   * @param {AudioContext} context
   * @param {object} args
   * @param {number} args.preBand
   * @param {number} args.color
   * @param {number} args.drive
   * @param {number} args.postCut
   */
  constructor(context, { bypass, color, preBand, postCut, drive }) {
    this.input = context.createGain()
    this.output = context.createGain()

    this.#bandpass = context.createBiquadFilter()
    this.#bpWet = context.createGain()
    this.#bpDry = context.createGain()
    this.#ws = context.createWaveShaper()
    this.#lowpass = context.createBiquadFilter()

    // AudioNode graph routing
    this.input.connect(this.#bandpass)
    this.#bandpass.connect(this.#bpWet)
    this.#bandpass.connect(this.#bpDry)
    this.#bpWet.connect(this.#ws)
    this.#bpDry.connect(this.#ws)
    this.#ws.connect(this.#lowpass)
    this.#lowpass.connect(this.output)

    this.bypass = bypass

    const { params } = Overdrive.meta()

    // Defaults
    this.#bandpass.frequency.value = color || params.color.defaultValue
    this.#bpWet.gain.value = preBand || params.preBand.defaultValue
    this.#lowpass.frequency.value = postCut || params.postCut.defaultValue
    this.drive = drive || params.drive.defaultValue

    // Inverted preBand value
    this.#bpDry.gain.value = preBand
      ? 1 - preBand
      : 1 - params.preBand.defaultValue
  }

  get preBand() {
    return this.#bpWet.gain.value
  }

  set preBand(value) {
    this.#bpWet.gain.setValueAtTime(value, 0)
    this.#bpDry.gain.setValueAtTime(1 - value, 0)
  }

  get color() {
    return this.#bandpass.frequency.value
  }

  set color(value) {
    this.#bandpass.frequency.setValueAtTime(value, 0)
  }

  get drive() {
    return this.#drive
  }

  set drive(value) {
    const k = value * 100
    const n = 22050
    const curve = new Float32Array(n)
    const deg = Math.PI / 180

    this.#drive = value
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1
      curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x))
    }

    this.#ws.curve = curve
  }

  get postCut() {
    return this.#lowpass.frequency.value
  }

  set postCut(value) {
    return this.#lowpass.frequency.setValueAtTime(value, 0)
  }

  get bypass() {
    return this.#bypass
  }

  set bypass(value) {
    if (value === true && this.#bypass === false) {
      this.input.disconnect(this.#bandpass)
      this.input.connect(this.output)
      this.#bypass = true
    } else if (value === false && this.#bypass === true) {
      this.input.disconnect(this.output)
      this.input.connect(this.#bandpass)
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

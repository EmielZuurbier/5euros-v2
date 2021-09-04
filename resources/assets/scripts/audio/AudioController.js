import { settingsStore, effectsStore } from '@data/store'
import { BitCrusher, Connector, Player, Overdrive, Reverb } from '@audio'

export default class AudioController {
  static get audioWorklets() {
    return [window.__appData__.worklets.bitCrusher]
  }

  /**
   * An AudioContext instance to decode and play audio with.
   * @var {AudioContext}
   */
  #context = null

  /**
   * The input where the player will be plugged into.
   */
  #effectsIn = null

  /**
   * The output that goes from the effects to the speakers.
   */
  #effectsOut = null

  /**
   * List of effects to keep track let the sound play through.
   * We're using a map because we want to guarantee the order while
   * still using a key-value structure.
   */
  #effects = new Map()

  /**
   * Storage for all current playing fragments.
   */
  playing = {}

  /**
   * Pass an existing audio context.
   * @param {AudioContext} context
   */
  constructor(context) {
    if (context instanceof AudioContext) {
      this.#context = context
    } else {
      this.#context = new AudioContext()
    }

    /**
     * Effects in.
     */
    this.#effectsIn = new Connector(this.#context)

    /**
     * Effects out.
     */
    this.#effectsOut = new Connector(this.#context)
    this.#effectsOut.connect(this.#context.destination)

    /**
     * First register the worklets, then do the effects.
     */
    this.registerAudioWorklets()
      .then(() => {
        this.createEffects()
        this.connectEffects()
        this.addEventListeners()
      })
      .catch(console.error)
  }

  /**
   * Registers the audio worklets specified in the audioWorklets static getter array.
   */
  async registerAudioWorklets() {
    await Promise.all(
      AudioController.audioWorklets.map(path =>
        this.#context.audioWorklet
          .addModule(path)
          .then(() =>
            console.debug(
              `Audio worklet from ${path} has been added successfully.`
            )
          )
      )
    )
  }

  /**
   * Adds the events to update the effects and play the sounds.
   */
  addEventListeners() {
    effectsStore.events.subscribe('speedChange', ({ playbackRate }) => {
      this.updateSpeed(playbackRate)
    })

    effectsStore.events.subscribe('overdriveChange', state => {
      this.updateEffect('overdrive', state)
    })

    effectsStore.events.subscribe('reverbChange', state => {
      this.updateEffect('reverb', state)
    })

    effectsStore.events.subscribe('bitCrusherChange', state => {
      this.updateEffect('bit-crusher', state)
    })

    /**
     * Play a fragment if a euros-data element is clicked.
     */
    window.addEventListener('click', event => {
      const dataElement = event.target.closest('euros-data')
      if (dataElement === null) {
        return
      }

      /**
       * Don't do anything when an element is disabled or still loading.
       */
      if (dataElement.disabled || dataElement.loading) {
        return
      }

      const { id } = dataElement

      /**
       * Check if crazy mode is active.
       */
      const isCrazyModeActive = settingsStore.states.crazyMode.active

      if (isCrazyModeActive) {
        this.play(dataElement)
        return
      }

      /**
       * Check if the current fragment is playing.
       * Stop it if it is and play it if it isn't
       */
      const isCurrentFragmentPlaying = this.isFragmentCurrentlyPlaying(id)
      if (isCurrentFragmentPlaying) {
        this.stopById(id)
      } else {
        this.stopAll()
        this.play(dataElement)
      }
    })
  }

  /**
   * Creates the effects and sets them in the #effects map.
   */
  createEffects() {
    const context = this.#context

    /**
     * Overdrive Effect.
     */
    const overdriveState = effectsStore.states.overdrive
    const overdrive = new Overdrive(context, overdriveState)
    this.#effects.set('overdrive', overdrive)

    /**
     * Reverb Effect.
     */
    const reverbState = effectsStore.states.reverb
    const reverb = new Reverb(context, reverbState)
    this.#effects.set('reverb', reverb)

    /**
     * BitCrusher effect.
     */
    const bitCrusherState = effectsStore.states.bitCrusher
    const bitCrusher = new BitCrusher(context, bitCrusherState)
    this.#effects.set('bit-crusher', bitCrusher)
  }

  /**
   * Updates a single effect with a group of values.
   * @param {string} effectName
   * @param {object} values
   */
  updateEffect(effectName, values) {
    const effect = this.#effects.get(effectName)

    if (!effect) {
      return
    }

    /**
     * Only update the values that differ from the current state.
     */
    for (const [key, value] of Object.entries(values)) {
      if (effect[key] !== value) {
        effect[key] = value
      }
    }
  }

  /**
   * Update the playbackRate value of the currently playing players.
   * @param {number} speed
   */
  updateSpeed(speed) {
    for (const player of Object.values(this.playing)) {
      player.speed = speed
    }
  }

  /**
   * Connects the active effects to each other and a destination.
   */
  connectEffects() {
    /**
     * Place the input first.
     * input --
     */
    const connectedEffects = [this.#effectsIn]

    /**
     * Append any effects that are active.
     * input -- effects --
     */
    for (const effect of this.#effects.values()) {
      connectedEffects.push(effect)
    }

    /**
     * The output should be last.
     * input -- effects -- output
     */
    connectedEffects.push(this.#effectsOut)

    /**
     * Connect the current effect to the next in the list.
     * This will connects the input with the effects and the
     * effects to the output creating a single effects link.
     */
    for (let i = 0; i < connectedEffects.length; i++) {
      const currentEffect = connectedEffects[i]
      const nextEffect = connectedEffects[i + 1]

      if (nextEffect) {
        currentEffect.connect(nextEffect)
      }
    }
  }

  /**
   * Loop over all effects and disconnect them.
   * @returns {void}
   */
  disconnectEffects() {
    this.#effectsIn.disconnect()
    for (const effect of this.#effects.values()) {
      effect.disconnect()
    }
  }

  /**
   * Disconnects and connects the effects.
   * @returns {void}
   */
  reconnectEffects() {
    this.disconnectEffects()
    this.connectEffects()
  }

  /**
   * Play
   * @param {HTMLElement} dataElement
   */
  play(dataElement) {
    /**
     * Get the buffer and the id from the element.
     */
    const { buffer, id } = dataElement

    /**
     * Creates a new buffer source node.
     * @var {AudioBufferSourceNode}
     */
    const player = new Player(this.#context, buffer, () => {
      /**
       * Only delete the reference to the player whenever its the same player.
       * With crazy mode the reference will always point to the last instance.
       */
      if (this.playing[id] === player) {
        delete this.playing[id]
        dataElement.playing = false
      }
    })

    /**
     * Store a reference to the bufferSource.
     */
    this.playing[id] = player

    /**
     * Connect the player to the effect.
     * The link should now look like this:
     * player --- effects --- speaker
     */
    player.connect(this.#effectsIn.input)

    /**
     * Set the playback rate to the player
     */
    player.speed = effectsStore.states.speed.playbackRate

    /**
     * Start playing.
     */
    player.start()

    /**
     * Set playing to true.
     */
    dataElement.playing = true
  }

  /**
   * Check if a fragment is currently playing.
   * @param {string} id ID of the fragment.
   * @returns
   */
  isFragmentCurrentlyPlaying(id) {
    return this.playing[id] !== undefined
  }

  /**
   * Stop a specific fragment by id.
   * @param {string} id
   */
  stopById(id) {
    if (this.playing?.[id]) {
      const player = this.playing[id]
      player.stop()
      player.disconnect()
    }
  }

  /**
   * Stop all bufferSources from playing.
   */
  stopAll() {
    for (const player of Object.values(this.playing)) {
      player.stop()
      player.disconnect()
    }
  }
}

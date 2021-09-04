const unmuteAudio = require('unmute-ios-audio')
import { audioContext, AudioController } from '@audio'
import { fontAwesome } from '@fonts'

import { dataStore, settingsStore } from '@data/store'
import { workerStore } from '@data/worker'

import { renderFragments, renderInner, clearFragments } from '@view/render'
import { CustomElementsDefiner } from '@util'
import {
  CategoryElement,
  ControlPanelElement,
  ControlButtonElement,
  CrazyButtonElement,
  DataElement,
  HapticElement,
  LinkElement,
  ObserverElement,
  ResetButtonElement,
  SearchButtonElement,
  SearchPanelElement
} from '@web-components'

export default {
  name: 'common',
  path: '*',
  events: {
    async setup() {
      /**
       * Define all custom elements.
       */
      await new CustomElementsDefiner('euros')
        .add('category', CategoryElement)
        .add('control-panel', ControlPanelElement)
        .add('control-button', ControlButtonElement)
        .add('crazy-button', CrazyButtonElement)
        .add('data', DataElement)
        .add('haptic', HapticElement)
        .add('link', LinkElement)
        .add('observer', ObserverElement)
        .add('reset', ResetButtonElement)
        .add('search-button', SearchButtonElement)
        .add('search-panel', SearchPanelElement)
        .defineAll()
    },

    async init() {
      /**
       * HACK: to unmute the audio on iOS devices.
       */
      unmuteAudio()

      /**
       * Register Service Worker.
       */
      try {
        const registration = await navigator.serviceWorker.register(
          window.__appData__.serviceWorker,
          {
            scope: '/'
          }
        )

        console.log(registration)
      } catch (error) {
        console.log(error)
      }

      /**
       * Iniate SVG icons
       */
      fontAwesome()

      /**
       * Create an audio controller isntance.
       */
      new AudioController(audioContext)

      /**
       * After getting the list, created a structured version of it.
       */
      dataStore.events.subscribe('listChange', ({ data }) => {
        dataStore.dispatch('structure', 'structureFragments', data)
      })

      /**
       * Render the fragments whenever the state changes.
       */
      dataStore.events.subscribe('structureChange', async () => {
        /**
         * Get the list from the store.
         */
        const list = dataStore.states.list.data

        /**
         * Get the list to append the data to.
         */
        const content = document.querySelector('.js-content')
        if (content === null) {
          return
        }

        /**
         * Clear the list.
         */
        await clearFragments(content)

        /**
         * Scroll back to top.
         */
        document.scrollingElement.scrollTo(0, 0)

        /**
         * Render the fragments and append the newly created elementts.
         * @var {DocumentFragment}
         */
        const fragments = renderFragments(list)

        /**
         * Append the fragments to the list.
         */
        requestAnimationFrame(() => {
          content.append(fragments)
        })
      })

      /**
       * Listen for elements coming into view.
       * Whene they do retrieve the media data from the store and pass it to the
       * worker so that it can download the images and audio.
       */
      window.addEventListener('dataintersecting', ({ target: dataElement }) => {
        /**
         * Get the data from the store.
         */
        const structure = dataStore.states.structure.data

        /**
         * Get the id and category from the data element.
         */
        const { id, category } = dataElement

        /**
         * Get the data based on the category and id.
         */
        const data = structure?.[category]?.items?.[id]
        if (data === undefined) {
          console.log('No fragment data with cat an id')
          return
        }

        /**
         * Set the loading state to true.
         */
        dataElement.loading = true

        /**
         * Let the worker get the image blob and audio file buffer.
         */
        workerStore.dispatch('getFragmentData', data)
      })

      /**
       * Render the innard of a data element whenever their data is received.
       */
      workerStore.subscribe('getFragmentData', payload => {
        renderInner(payload)
      })

      /**
       * Listen for any errors received by the worker.
       */
      workerStore.subscribe('error', error => {
        console.log(error)
      })

      /**
       * Let the body know that crazy mode is active.
       */
      settingsStore.events.subscribe('crazyModeChange', ({ active }) => {
        document.body.classList.toggle('crazy-mode-active', active)
      })

      settingsStore.events.subscribe('searchPanelChange', ({ opened }) => {
        document.body.classList.toggle('search-panel-opened', opened)
      })

      settingsStore.events.subscribe('controlPanelChange', ({ opened }) => {
        document.body.classList.toggle('control-panel-opened', opened)
      })
    },

    finalize() {
      // Tell the DOM that JS has been loaded and running.
      document.documentElement.classList.add('js-ready')
    }
  }
}

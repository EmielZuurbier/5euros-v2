import { dataStore } from '@data/store'
import { clearFragments } from '@view/render'
import { createObserverElement } from '@view/templates'

export default {
  load() {
    const mainContent = document.querySelector('.js-main-content')
    if (mainContent === null) {
      return
    }

    /**
     * Create an observer element and add it to the main content.
     */
    const observerElement = createObserverElement()
    requestAnimationFrame(() => {
      mainContent.append(observerElement)
    })

    /**
     * Get the data from the server.
     */
    dataStore.dispatch('list', 'getFragments')
  },

  async unload() {
    /**
     * Get the list to append the data to.
     */
    const observer = document.querySelector('.js-observer')
    if (observer === null) {
      return
    }

    /**
     * Clear the list and remove the observer
     */
    await clearFragments(observer)
    requestAnimationFrame(() => {
      observer.remove()
    })
  }
}

import { dataStore } from '@data/store'

export default {
  async load({ pageId }) {
    if (pageId === undefined) {
      return
    }

    /**
     * Get the data from the server.
     */
    dataStore.dispatch('page', 'getPage', pageId)
  },

  async unload() {
    const mainContent = document.querySelector('.js-main-content')
    if (mainContent === null) {
      return
    }

    const pageContent = document.querySelector('.js-page-content')
    if (pageContent === null) {
      return
    }

    pageContent.classList.replace('page-in', 'page-out')
    await new Promise(resolve => {
      pageContent.addEventListener('animationend', resolve, { once: true })
    })

    pageContent.remove()
  }
}

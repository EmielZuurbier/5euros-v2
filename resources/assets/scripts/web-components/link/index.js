import { Router } from '@util'
import html from './template.html'

const template = document.createElement('template')
template.innerHTML = html

export default class LinkElement extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    shadow.append(template.content.cloneNode(true))
  }

  /**
   * Returns the first anchor element from the slot.
   */
  get anchor() {
    const slot = this.shadowRoot.querySelector('slot')
    const elements = slot.assignedElements()

    if (elements.length === 0) {
      return null
    }

    const [anchor] = elements
    return anchor
  }

  /**
   * Set the event listeners when connected
   * @returns {void}
   */
  connectedCallback() {
    if (this.anchor === null) {
      return
    }

    this.addEventListener('click', this.onClick)
  }

  /**
   * Remove the event listeners when disconnecting
   */
  disconnectedCallback() {
    this.removeEventListener('click', this.onClick)
  }

  /**
   * Set the push state on a click.
   * @param {Event} event MouseEvent object
   */
  onClick = event => {
    const { target } = event
    const { href, title, dataset } = target

    Router.navigate(href, title, {
      pageId: dataset.pageId
    })
    event.preventDefault()
  }
}

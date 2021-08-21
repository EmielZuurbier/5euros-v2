import html from './template.html'

const template = document.createElement('template')
template.innerHTML = html

export default class LinkElement extends HTMLElement {
  constructor() {
    super()

    const shadow = this.attachShadow({ mode: 'open' })
    shadow.append(template.content.cloneNode(true))
  }

  get anchor() {
    const slot = this.shadowRoot.querySelector('slot')
    const elements = slot.assignedElements()

    if (elements.length === 0) {
      return null
    }

    return elements[0]
  }

  connectedCallback() {
    if (this.anchor === null) {
      return
    }

    this.addEventListener('click', this.onClick)
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.onClick)
  }

  onClick = event => {
    const { target } = event
    const { href, title } = target

    /**
     * Change the URL.
     */
    history.pushState({}, title, href)

    /**
     * Get the pathname from the href.
     */
    const url = new URL(href)

    /**
     * Send out an event saying that the navigation has changed.
     */
    const navigationEvent = new CustomEvent('navigation', {
      detail: {
        url
      }
    })
    window.dispatchEvent(navigationEvent)

    event.preventDefault()
  }
}

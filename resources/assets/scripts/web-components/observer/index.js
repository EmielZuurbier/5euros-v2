/**
 * Checks when elements come and leave the view.
 * Uses a combination of a MutationObserver to know what elements are in the DOM and
 * an IntersectionObserver to register whenever an element is in the viewport.
 * @class
 */
class ObserverElement extends HTMLElement {
  /**
   * A MutationObserver instance.
   * @var {MutationObserver}
   */
  #mutationObserver = null

  /**
   * An IntersectionObserver instance.
   * @var {IntersectionObserver}
   */
  #intersectionObserver = null

  /**
   * @constructor
   */
  constructor() {
    super()
  }

  /**
   * Observe elements that are added as children and unobserve them whenever they
   * are in view or are removed from the DOM.
   * @method	connectedCallback
   * @returns	{void}
   */
  connectedCallback() {
    const mutationConfig = {
      attributes: false,
      childList: true,
      subtree: false
    }

    /**
     * Observer elements that are added to the DOM and unobserver elements that
     * are removed from the DOM.
     * @param {MutationRecord[]} mutationsList
     */
    const onMutation = mutationsList => {
      for (const { addedNodes, removedNodes } of mutationsList) {
        if (addedNodes.length) {
          for (const node of addedNodes) {
            this.#intersectionObserver.observe(node)
          }
        }

        if (removedNodes.length) {
          for (const node of removedNodes) {
            this.#intersectionObserver.unobserve(node)
          }
        }
      }
    }

    const intersectionConfig = {
      root: null,
      rootMargin: '100px 0px',
      threshold: [0]
    }

    /**
     * Fire an event notifying that the fragment is in view.
     * Then stop observing that fragment.
     * @param {IntersectionObserverEntry[]} entries
     * @param {IntersectionObserver} observer
     */
    const onIntersection = (entries, observer) => {
      for (const { target, isIntersecting } of entries) {
        if (
          isIntersecting &&
          target.tagName.toLocaleLowerCase() === 'euros-data'
        ) {
          const dataIntersectingEvent = new CustomEvent('dataintersecting', {
            bubbles: true,
            cancelable: true
          })
          target.dispatchEvent(dataIntersectingEvent)
          observer.unobserve(target)
        }
      }
    }

    this.#mutationObserver = new MutationObserver(onMutation)
    this.#intersectionObserver = new IntersectionObserver(
      onIntersection,
      intersectionConfig
    )

    this.#mutationObserver.observe(this, mutationConfig)
  }

  /**
   * Unobserve the observer element and all of it's children.
   */
  disconnectedCallback() {
    this.#mutationObserver.disconnect()
    this.#intersectionObserver.disconnect()
  }
}

export default ObserverElement

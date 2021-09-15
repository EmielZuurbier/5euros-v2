/**
 * Creates an observer element.
 * @returns HTMLElement
 */
const createObserverElement = () => {
  const observer = document.createElement('euros-observer')
  observer.className = 'js-observer'

  return observer
}

export default createObserverElement

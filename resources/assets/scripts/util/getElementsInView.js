/**
 * Returns an array of elements that are currently in voew.
 * @param {string} selector A CSS selector to query elements.
 * @param {boolean} partially Detect elements that are partially in view. Otherwise they would have to be fully in view.
 * @returns {HTMLElement[]}
 */
const getElementsInView = (selector = '*', partially = true) =>
  new Promise(resolve => {
    const elements = document.querySelectorAll(selector)

    if (elements.length === 0) {
      resolve([])
    }

    const elementsInView = []

    const onIntersect = (entries, observer) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) {
          elementsInView.push(target)
        }
      }

      observer.disconnect()
      resolve(elementsInView)
    }

    const observerInit = {
      root: null,
      rootMargin: '0px',
      threshold: partially ? [0] : [1]
    }

    const observer = new IntersectionObserver(onIntersect, observerInit)

    for (const element of elements) {
      observer.observe(element)
    }
  })

export default getElementsInView

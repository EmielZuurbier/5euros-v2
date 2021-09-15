import { getElementsInView, createRandomDelay } from '@util'

/**
 * Clear all fragments from the DOM.
 * Whenever an animation element is used, it will animate out and then remove the element.
 * @param {HTMLElement} parent
 */
export default async parent => {
  /**
   * Get all elements in view.
   * Stop the function if there are no elements found.
   */
  const elementsInView = await getElementsInView('euros-data, euros-category')
  if (elementsInView.length === 0) {
    return
  }

  /**
   * Collect the animations to wait for all of them to finish.
   */
  const animations = []

  /**
   * Loop over elements in view and animate them out.
   */
  for (const element of elementsInView) {
    const animationElement = element.firstElementChild
    const animationDelay = createRandomDelay()

    if (animationElement.classList.contains('data-in')) {
      animationElement.style.animationDelay = `${animationDelay}ms`
      animationElement.classList.replace('data-in', 'data-out')

      const animation = new Promise(resolve => {
        animationElement.addEventListener('animationend', () => {
          resolve(element)
        })
      })

      animations.push(animation)
    }
  }

  /**
   * Wait for all animations to finish.
   */
  await Promise.all(animations)

  /**
   * Remove all children
   */
  for (const child of parent.children) {
    requestAnimationFrame(() => {
      child.remove()
    })
  }
}

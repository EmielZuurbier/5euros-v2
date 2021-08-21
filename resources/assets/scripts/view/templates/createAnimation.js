/**
 * Returns an element that has the purpose of animating it's content.
 * @param {string} animation
 * @param {number} delay
 * @returns {HTMLElement}
 */
const createAnimationElement = (animation, delay = 0) => {
  const animationElement = document.createElement('div')
  animationElement.className = animation
  animationElement.style.animationDelay = `${delay}ms`
  return animationElement
}

export default createAnimationElement

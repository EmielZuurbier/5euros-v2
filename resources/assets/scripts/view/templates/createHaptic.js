/**
 * Returns an element responsible for giving haptic feedback.
 * @param {number} duration
 * @returns {HTMLElement}
 */
const createHapticElement = duration => {
  const hapticElement = document.createElement('euros-haptic')

  if (duration && typeof duration === 'number') {
    hapticElement.duration = duration
  }

  return hapticElement
}

export default createHapticElement

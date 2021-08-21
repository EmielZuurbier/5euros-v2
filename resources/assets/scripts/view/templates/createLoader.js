/**
 * Returns a loader element.
 * @returns {HTMLElement}
 */
const createLoaderElement = () => {
  const loader = document.createElement('div')
  loader.className = 'loader'

  const inner = document.createElement('div')
  inner.className = 'loader-inner'

  for (let i = 0; i < 3; i++) {
    const span = document.createElement('span')
    inner.append(span)
  }

  loader.append(inner)
  return loader
}

export default createLoaderElement

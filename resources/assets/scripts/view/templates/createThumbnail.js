/**
 * Returns a figure with an image in it.
 * @return {HTMLElement}
 */
const createThumbnailElement = (src, alt = '') => {
  const figure = document.createElement('figure')
  const image = new Image()

  figure.className = 'inner-thumbnail thumbnail-in'
  image.src = src
  image.alt = alt

  figure.append(image)
  return figure
}

export default createThumbnailElement

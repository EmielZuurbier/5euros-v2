/**
 * Renders a structure for page posts.
 * @param {object} args
 * @param {object} args.title
 * @param {object} args.content
 * @returns {HTMLElement}
 */
export default ({ title, content }) => {
  const articleElement = document.createElement('article')
  articleElement.className = 'page-content page-in js-page-content'

  const headerElement = document.createElement('header')
  headerElement.clasName = 'page-header'

  const titleElement = document.createElement('h1')
  titleElement.textContent = title.rendered

  const contentElement = document.createElement('div')
  contentElement.innerHTML = content.rendered

  headerElement.append(titleElement)
  articleElement.append(headerElement, contentElement)

  return articleElement
}

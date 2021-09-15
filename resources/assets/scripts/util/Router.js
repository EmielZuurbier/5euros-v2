/**
 * DOM-based Routing
 *
 * Based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 *
 * The routing fires all common scripts, followed by the page specific scripts.
 * Add additional events for more control over timing e.g. a finalize event
 */
export default class Router {
  /**
   * Fire the navigation event and update the history state.
   * @static
   * @param {string} href
   * @param {string} title
   * @returns {void}
   */
  static navigate = (href, title, args) => {
    const state = {
      oldUrl: new URL(location.href).pathname,
      newUrl: new URL(href).pathname,
      args
    }

    window.dispatchEvent(
      new CustomEvent('navigation', {
        detail: state
      })
    )

    history.pushState(state, title, href)
  }

  /**
   * Navigate back and fire the popstate event.
   * @static
   * @returns {void}
   */
  static back = () => {
    history.back()
  }

  /**
   * Store the routes.
   */
  #routes = {}

  /**
   * Unload the current route and the fire the controllers for the new route.
   * @param {CustomEvent} event
   */
  #onNavigation = async event => {
    const { newUrl, oldUrl, args } = event.detail
    const currentRoute = this.getRoute(oldUrl)

    if (currentRoute !== undefined) {
      await this.fire(currentRoute, 'unload')
    }

    await this.loadRoute(newUrl, args)
  }

  /**
   * Send out an event saying that the navigation has changed.
   */
  #onPopState = ({ state }) => {
    window.dispatchEvent(
      new CustomEvent('navigation', {
        detail: state
      })
    )
  }

  /**
   * Create a new Router
   * @param {Object} routes
   */
  constructor(routes) {
    this.#routes = routes

    window.addEventListener('navigation', this.#onNavigation)
    window.addEventListener('popstate', this.#onPopState)
  }

  /**
   * Fire Router events
   * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
   * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
   * @param {string} [arg] Any custom argument to be passed to the event.
   */
  async fire(route, event = 'load', args) {
    const hasEvent = route[event] && typeof route[event] === 'function'

    if (!hasEvent) {
      return null
    }

    return route[event](args)
  }

  get currentPath() {
    return location.pathname
  }

  /**
   * Returns an array of routes that should be fired on the common path.
   * @returns {Object}
   */
  getCommonRoute() {
    return this.getRoute('*')
  }

  /**
   * Returns a specific route based on a pathname.
   * @param {string} pathname The path to filter on.
   * @returns {(Object[]|undefined)}
   */
  getRoute(pathname) {
    return this.#routes?.[pathname]
  }

  /**
   * Load the common routes and the current route we're on.
   */
  async loadInitialRoute() {
    const commonRoute = this.getCommonRoute()

    await this.fire(commonRoute)
    await this.loadRoute(this.currentPath)
    await this.fire(commonRoute, 'finalize')
  }

  /**
   * Load a route based on a pathname.
   * @param {string} pathname The path of the route to load.
   * @param {any} args Additonal arguments for the route.
   * @returns {Promise}
   */
  async loadRoute(pathname, args) {
    const route = this.getRoute(pathname)

    if (route === undefined) {
      return
    }

    await this.fire(route, 'load', args)
    await this.fire(route, 'finalize')
  }
}

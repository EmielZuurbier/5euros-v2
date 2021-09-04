import camelCase from './camelCase'

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
   * Store the routes.
   */
  #routes = {}

  /**
   * Create a new Router
   * @param {Object} routes
   */
  constructor(routes) {
    this.#routes = routes

    window.addEventListener('navigation', this.onNavigation)
    window.addEventListener('popstate', this.onPopState)
  }

  /**
   * Fire Router events
   * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
   * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
   * @param {string} [arg] Any custom argument to be passed to the event.
   */
  async fire(route, event = 'init', arg) {
    document.dispatchEvent(
      new CustomEvent('routed', {
        bubbles: true,
        detail: {
          route,
          fn: event
        }
      })
    )

    const fire =
      route !== '' &&
      this.#routes[route] &&
      typeof this.#routes[route].events[event] === 'function'
    if (fire) {
      return this.#routes[route].events[event](arg)
    }
  }

  getCommonRoutes() {
    return Object.values(this.#routes).map(({ path }) => path === '*')
  }

  // async loadRoute(path) {

  // }

  // async loadCommonRoute() {
  //   await this.fire('common')
  //   await this.fire('common', 'customElements')
  //   await this.fire('common', 'finalize')
  // }

  /**
   * Automatically load and fire Router events
   *
   * Events are fired in the following order:
   *  * common init
   *  * page-specific init
   *  * page-specific finalize
   *  * common finalize
   */
  async loadEvents() {
    // Fire common init JS
    await this.fire('common', 'setup')
    await this.fire('common')

    // Fire page-specific init JS, and then finalize JS
    const classNames = document.body.className
      .toLowerCase()
      .replace(/-/g, '_')
      .split(/\s+/)
      .map(camelCase)

    for (const className of classNames) {
      await this.fire(className)
      await this.fire(className, 'finalize')
    }

    // Fire common finalize JS
    this.fire('common', 'finalize')
  }

  onNavigation = event => {
    console.log(event)
  }

  onPopState = event => {
    console.log(event)
  }
}

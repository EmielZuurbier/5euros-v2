// Import everything from autoload
import './autoload/**/*'

// import local dependencies
import { Router } from '@util'
import { common, home, support } from '@routes'
/** Populate Router instance with DOM routes */
const routes = new Router({
  '*': common,
  '/': home,
  '/support-ons/': support
})

routes.loadInitialRoute()

// Load Events
// routes.loadEvents()

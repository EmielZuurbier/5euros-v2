// Import everything from autoload
import './autoload/**/*'

// import local dependencies
import { Router } from '@util'
import { common, home } from '@routes'
/** Populate Router instance with DOM routes */
const routes = new Router({
  common,
  home
})

// Load Events
routes.loadEvents()

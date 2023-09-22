import Vue from 'vue'
import Router from 'vue-router'

import frameRoutes from './frames'
import route404 from './404'

Vue.use(Router)

// Global 404 routing
const globalRoute404 = {
  ...route404,
  path: '/404'
}

// Routing
const routes = [
  {
    path: '/',
    redirect: '/default/page/1'
  },

  // Frame sub-routing
  ...frameRoutes,

  // Root route 404
  globalRoute404,

  // Unmatched route 404
  {
    path: '*',
    redirect(to) {
      const match = /^(\/[^/]+\/)/.exec(to.path)

      if (match) {
        const base = match[1]
        const matchParent = $router.options.routes.find(
          item => item.path === base
        )

        // Subroutes 404
        if (matchParent) return base + '404'
      }

      // Root route 404
      return '/404'
    }
  }
]

// Vue Router Example
const $router = new Router({ routes })

export default $router

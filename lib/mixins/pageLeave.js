import { emptyObj } from '../util'

// Route navigation guard
export const leaveGuard = router => (to, from, next) => {
  const { $tabs } = router.app

  if (!$tabs) {
    next()
    return
  }

  const fromId = $tabs.getRouteKey(from)
  const toId = $tabs.getRouteKey(to)
  const { $alive } = $tabs
  const fromCache = $alive && $alive.cache[fromId]
  const { alivePath } = ($alive && $alive.cache[toId]) || emptyObj
  const matched = $tabs.matchRoute(to)

  let id, type

  if (alivePath && alivePath !== matched.alivePath) {
    // The tag address is replaced: to exists in the cache but the cache route is inconsistent
    type = 'replace'
    id = toId
  } else if ($alive.basePath !== matched.basePath) {
    // Leaving the tab component: to is not under the current tab component route
    type = 'leave'
    id = $tabs.activeTabId
  } else if (!fromCache && fromId !== toId) {
    // Leave the tab when the current component is not cached
    type = 'leave'
    id = $tabs.activeTabId
  }

  if (type) {
    $tabs
      .leavePage(id, type)
      .then(next)
      .catch(() => next(false))
  } else {
    next()
  }
}

// Page away
export default {
  created() {
    const { $router } = this

    if ($router._RouterTabInit) return

    // Initialize route navigation guard
    $router.beforeEach(leaveGuard($router))
    $router._RouterTabInit = true
  },

  methods: {
    // Page leaves Promise
    async leavePage(id, type) {
      const tab = this.items.find(item => item.id === id) // Current tab
      let { vm } = this.$alive.cache[id] || emptyObj // Cache data

      // When caching is not enabled, obtain the current page component instance
      if (!vm && this.activeTabId === id) {
        try {
          vm = this.$route.matched[this.$alive.routeMatch.routeIndex].instances.default
        } catch (_) {
          vm = null
        }
      }

      if (!vm || !tab) return

      const pageLeave = vm.$vnode.componentOptions.Ctor.options.beforePageLeave

      if (typeof pageLeave === 'function') {
        // Before closing the tab
        return pageLeave.bind(vm)(tab, type)
      }
    }
  }
}

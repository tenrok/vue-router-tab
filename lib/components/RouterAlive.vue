<template>
  <div
    class="router-alive"
    @drop="onDrop($event)"
    @dragover.prevent="onDragOver($event)"
    @dragenter.prevent
  >
    <transition
      v-bind="pageTrans"
      appear
      @after-enter="onTrans"
      @after-leave="onTrans"
    >
      <keep-alive :max="max">
        <router-view
          v-if="alive && !onRefresh"
          ref="page"
          :key="key"
          :class="pageClass"
          v-on="hooks"
          @page-loaded="onPageLoaded"
        />
      </keep-alive>
    </transition>

    <transition
      v-bind="pageTrans"
      appear
      @after-enter="onTrans"
      @after-leave="onTrans"
    >
      <router-view
        v-if="!alive && !onRefresh"
        ref="page"
        :key="key"
        :class="pageClass"
      />
    </transition>
  </div>
</template>

<script>
  import { remove, mapGetters, getTransOpt, getCtorId } from '../util'
  import RouteMatch from '../util/RouteMatch'

  // Page listener hook
  const PAGE_HOOKS = ['created', 'mounted', 'activated', 'deactivated', 'destroyed']

  const TRANSFER_PREFIX = 'RouterTabDragSortIndex:'

  /**
   * Route cache control
   */
  export default {
    name: 'RouterAlive',

    inject: ['onTabEvent'],

    provide() {
      // Provide an instance to the child component to call
      return {
        RouterAlive: this
      }
    },

    props: {
      // Is caching enabled by default?
      keepAlive: {
        type: Boolean,
        default: false
      },

      // Whether to reuse routing components
      reuse: {
        type: Boolean,
        default: false
      },

      // Maximum number of caches, 0 means no limit
      max: {
        type: Number,
        default: 0
      },

      // Page class
      pageClass: {
        type: [Array, Object, String],
        default: 'router-alive-page'
      },

      // Page scroll element selector
      pageScroller: {
        type: String,
        default: ''
      },

      // Transition effects
      transition: {
        type: [String, Object]
      }
    },

    data() {
      // Cache records
      this.cache = {}

      return {
        // Route matching information
        routeMatch: new RouteMatch(this),

        // Page routing index
        routeIndex: this.getRouteIndex(),

        // Is it updating?
        onRefresh: false
      }
    },

    computed: {
      // Extract computed properties from this.routeMatch
      ...mapGetters('routeMatch', ['key', 'meta', 'nest', 'alive', 'reusable', 'basePath', 'alivePath']),

      // Listening for subpage hooks
      hooks() {
        return PAGE_HOOKS.reduce((events, hook) => {
          events['hook:' + hook] = () => this.pageHook(hook)
          return events
        }, {})
      },

      // Page transition
      pageTrans() {
        return getTransOpt(this.transition)
      }
    },

    watch: {
      // Watch route
      $route: {
        handler($route, old) {
          // Component ready
          if (!old) this.$emit('ready', this)

          if (!$route.matched.length) return

          const { key, alive, reusable, alivePath, nest } = this
          const cacheItem = this.cache[key] || {}
          let { alivePath: cacheAlivePath, fullPath: cacheFullPath, vm: cacheVM } = cacheItem

          // If it is not reused and the route changes, the component cache is cleaned up
          if (cacheAlivePath && !reusable && cacheAlivePath !== alivePath) {
            cacheAlivePath = ''
            this.refresh(key)
          }

          // Nested routing, the address is inconsistent with the cache
          if (nest && cacheVM && $route.fullPath !== cacheFullPath) {
            const oldKey = this.matchRoute(old).key
            if (oldKey !== key) {
              this.nestForceUpdate = true
            }
          }

          // Type: update or new cache
          const type = cacheAlivePath ? 'update' : 'create'

          this.$emit('change', type, this.routeMatch)

          // Update cache path
          if (alive) {
            cacheItem.fullPath = $route.fullPath
          }
        },

        immediate: true
      }
    },

    mounted() {
      // Get keepAlive component instance
      this.$refs.alive = this._vnode.children[0].child._vnode.componentInstance
    },

    // Cleaning up after destruction
    destroyed() {
      this.cache = null
      this.routeMatch = null
      this._match = null
      this.$refs.alive = null
    },

    methods: {
      onDragOver(e) {
        e.dataTransfer.dropEffect = 'link'
      },

      onDrop(e) {
        const { items } = this.$tabs
        const raw = e.dataTransfer.getData('text')

        if (typeof raw !== 'string' || !raw.startsWith(TRANSFER_PREFIX)) return

        const fromIndex = raw.replace(TRANSFER_PREFIX, '')
        const tab = items[fromIndex]

        this.onTabEvent('drop-alive', { $tabs: this.$tabs, data: tab })
      },

      // Get page routing index
      getRouteIndex() {
        let cur = this
        let depth = -1 // routing depth

        while (cur && depth < 0) {
          const { data } = cur.$vnode || {}
          if (data && data.routerView) {
            depth = data.routerViewDepth
          } else {
            cur = cur.$parent
          }
        }

        return depth + 1
      },

      // Remove cache
      remove(key = this.key) {
        const $alive = this.$refs.alive

        if (!$alive) return

        const cacheItem = this.cache[key]
        const { cache, keys } = $alive

        // Destroy the cache component instance and clean up the Router Alive cache records
        if (cacheItem) {
          cacheItem.vm.$destroy()
          cacheItem.vm = null
          this.cache[key] = null
        }

        // Clear keepAlive cache records
        Object.entries(cache).find(([id, item]) => {
          const vm = item?.componentInstance
          if (vm?.$vnode?.data?.key === key) {
            // Destroy component instance
            vm.$destroy()

            cache[id] = null
            remove(keys, id)

            return true
          }
        })
      },

      // Refresh
      refresh(key = this.key) {
        this.remove(key)

        // Not the current cache, remove directly
        if (key === this.key) {
          this.reload()
        }
      },

      // Reload
      reload() {
        if (this.onRefresh) return

        this.onRefresh = true
      },

      // Cache page component hook
      pageHook(hook) {
        const handler = this[`pageHook:${hook}`]
        if (typeof handler === 'function') handler()
      },

      // Page creation
      'pageHook:created'() {
        this.cache[this.key] = {
          alivePath: this.alivePath,
          fullPath: this.$route.fullPath
        }
      },

      // Page mounting
      'pageHook:mounted'() {
        this.cache[this.key].vm = this.$refs.page

        // Reset initial scroll position
        this.resetScrollPosition()
      },

      // Page activation
      'pageHook:activated'() {
        const pageVm = this.$refs.page

        // Hot reload updates
        if (this.checkHotReloading()) return

        // Nested routing cache causes forced update when page does not match
        if (this.nestForceUpdate) {
          delete this.nestForceUpdate
          pageVm.$forceUpdate()
        }

        // Restore scroll position
        this.restoreScrollPosition()
      },

      // Page deactivation
      'pageHook:deactivated'() {
        if (this.checkHotReloading()) return

        // Save scroll position
        this.saveScrollPosition()
      },

      // Clean up cache after page destruction
      async 'pageHook:destroyed'() {
        await this.$nextTick()

        if (!this.cache) return

        // Clear cached information of destroyed pages
        Object.entries(this.cache).forEach(([key, item]) => {
          const { vm } = item || {}
          if (vm && vm._isDestroyed) {
            this.remove(key)
          }
        })
      },

      // End refresh state after page transition
      onTrans() {
        if (this.onRefresh) {
          this.onRefresh = false
          this.$emit('change', 'create', this.routeMatch)
        }
      },

      // Match routing information
      matchRoute($route) {
        const matched = this._match

        // Current routes
        if ($route === this.$route || $route.fullPath === this.$route.fullPath || $route === this.$route.fullPath) {
          return this.routeMatch
        }

        if (matched) {
          matched.$route = $route
          return matched
        }

        return (this._match = new RouteMatch(this, $route))
      },

      // Detect hot reload
      checkHotReloading() {
        const pageVm = this.$refs.page
        const lastCid = pageVm._lastCtorId
        const cid = (pageVm._lastCtorId = getCtorId(pageVm))

        // Hot reload update
        if (lastCid && lastCid !== cid) {
          this.refresh()
          return true
        }

        return false
      },

      // Get the scroll element
      getScroller(selector) {
        return selector.startsWith('$') ? document.querySelector(selector.replace(/^\$/, '')) : this.$el.querySelector(selector)
      },

      // Save scroll position
      saveScrollPosition() {
        const pageVm = this.$refs.page

        if (!pageVm) return

        // Scroll elements configured inside the page
        let { pageScroller } = pageVm.$vnode.componentOptions.Ctor.options

        if (typeof pageScroller === 'string' && pageScroller.length) {
          pageScroller = pageScroller.split(/\s?,\s?/)
        }

        if (!Array.isArray(pageScroller)) {
          pageScroller = []
        }

        // The default save page root node location
        pageScroller.push('.' + this.pageClass)

        // Add global scroll element configuration
        // Component external selectors are distinguished by the $ prefix
        if (this.pageScroller) {
          pageScroller.push('$' + this.pageScroller)
        }

        // Recording location
        const position = pageScroller.reduce((pos, selector) => {
          const el = this.getScroller(selector)

          if (el) {
            pos[selector] = {
              left: el.scrollLeft,
              top: el.scrollTop
            }
          }

          return pos
        }, {})

        pageVm._pageScrollPosition = position
      },

      // Restore scroll position
      restoreScrollPosition() {
        const pageVm = this.$refs.page
        const position = pageVm?._pageScrollPosition

        if (!position) return

        Object.entries(position).forEach(([selector, pos]) => {
          const el = this.getScroller(selector)
          if (el) {
            el.scrollLeft = pos.left
            el.scrollTop = pos.top
          }
        })
      },

      // Reset global scroll position
      resetScrollPosition() {
        if (!this.pageScroller) return

        const el = this.getScroller('$' + this.pageScroller)

        if (!el) return

        el.scrollLeft = 0
        el.scrollTop = 0
      },

      // Page data loaded successfully
      async onPageLoaded() {
        await this.$nextTick()
        // Restore scroll position after page data is loaded successfully
        this.restoreScrollPosition()
      }
    }
  }
</script>

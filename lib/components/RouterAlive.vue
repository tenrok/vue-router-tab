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
const PAGE_HOOKS = [
  'created',
  'mounted',
  'activated',
  'deactivated',
  'destroyed'
]

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
    // 默认是否开启缓存
    keepAlive: {
      type: Boolean,
      default: false
    },

    // 是否复用路由组件
    reuse: {
      type: Boolean,
      default: false
    },

    // 最大缓存数，0 则不限制
    max: {
      type: Number,
      default: 0
    },

    // 页面 class
    pageClass: {
      type: [Array, Object, String],
      default: 'router-alive-page'
    },

    // 页面滚动元素选择器
    pageScroller: {
      type: String,
      default: ''
    },

    // 过渡效果
    transition: {
      type: [String, Object]
    }
  },

  data() {
    // 缓存记录
    this.cache = {}

    return {
      // Route matching information
      routeMatch: new RouteMatch(this),

      // 页面路由索引
      routeIndex: this.getRouteIndex(),

      // 是否正在更新
      onRefresh: false
    }
  },

  computed: {
    // 从 this.routeMatch 提取计算属性
    ...mapGetters('routeMatch', [
      'key',
      'meta',
      'nest',
      'alive',
      'reusable',
      'basePath',
      'alivePath'
    ]),

    // 监听子页面钩子
    hooks() {
      return PAGE_HOOKS.reduce((events, hook) => {
        events['hook:' + hook] = () => this.pageHook(hook)
        return events
      }, {})
    },

    // 页面过渡
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
        let {
          alivePath: cacheAlivePath,
          fullPath: cacheFullPath,
          vm: cacheVM
        } = cacheItem

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
    // 获取 keepAlive 组件实例
    this.$refs.alive = this._vnode.children[0].child._vnode.componentInstance
  },

  // 销毁后清理
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

    // 获取页面路由索引
    getRouteIndex() {
      let cur = this
      let depth = -1 // 路由深度

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

    // 移除缓存
    remove(key = this.key) {
      const $alive = this.$refs.alive

      if (!$alive) return

      const cacheItem = this.cache[key]
      const { cache, keys } = $alive

      // 销毁缓存组件实例，清理 RouterAlive 缓存记录
      if (cacheItem) {
        cacheItem.vm.$destroy()
        cacheItem.vm = null
        this.cache[key] = null
      }

      // 清理 keepAlive 缓存记录
      Object.entries(cache).find(([id, item]) => {
        const vm = item?.componentInstance
        if (vm?.$vnode?.data?.key === key) {
          // 销毁组件实例
          vm.$destroy()

          cache[id] = null
          remove(keys, id)

          return true
        }
      })
    },

    // 刷新
    refresh(key = this.key) {
      this.remove(key)

      // 非当前缓存，直接移除
      if (key === this.key) {
        this.reload()
      }
    },

    // 重新加载
    reload() {
      if (this.onRefresh) return

      this.onRefresh = true
    },

    // 缓存页面组件钩子
    pageHook(hook) {
      const handler = this[`pageHook:${hook}`]
      if (typeof handler === 'function') handler()
    },

    // 页面创建
    'pageHook:created'() {
      this.cache[this.key] = {
        alivePath: this.alivePath,
        fullPath: this.$route.fullPath
      }
    },

    // 页面挂载
    'pageHook:mounted'() {
      this.cache[this.key].vm = this.$refs.page

      // 重置初始滚动位置
      this.resetScrollPosition()
    },

    // 页面激活
    'pageHook:activated'() {
      const pageVm = this.$refs.page

      // 热重载更新
      if (this.checkHotReloading()) return

      // 嵌套路由缓存导致页面不匹配时强制更新
      if (this.nestForceUpdate) {
        delete this.nestForceUpdate
        pageVm.$forceUpdate()
      }

      // 还原滚动位置
      this.restoreScrollPosition()
    },

    // 页面失活
    'pageHook:deactivated'() {
      if (this.checkHotReloading()) return

      // 保存滚动位置
      this.saveScrollPosition()
    },

    // 页面销毁后清理 cache
    async 'pageHook:destroyed'() {
      await this.$nextTick()

      if (!this.cache) return

      // 清理已销毁页面的缓存信息
      Object.entries(this.cache).forEach(([key, item]) => {
        const { vm } = item || {}
        if (vm && vm._isDestroyed) {
          this.remove(key)
        }
      })
    },

    // 页面过渡后结束刷新状态
    onTrans() {
      if (this.onRefresh) {
        this.onRefresh = false
        this.$emit('change', 'create', this.routeMatch)
      }
    },

    // Match routing information
    matchRoute($route) {
      const matched = this._match

      // 当前路由
      if (
        $route === this.$route ||
        $route.fullPath === this.$route.fullPath ||
        $route === this.$route.fullPath
      ) {
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

    // 获取滚动元素
    getScroller(selector) {
      return selector.startsWith('$')
        ? document.querySelector(selector.replace(/^\$/, ''))
        : this.$el.querySelector(selector)
    },

    // 保存滚动位置
    saveScrollPosition() {
      const pageVm = this.$refs.page

      if (!pageVm) return

      // 页面内部配置的滚动元素
      let { pageScroller } = pageVm.$vnode.componentOptions.Ctor.options

      if (typeof pageScroller === 'string' && pageScroller.length) {
        pageScroller = pageScroller.split(/\s?,\s?/)
      }

      if (!Array.isArray(pageScroller)) {
        pageScroller = []
      }

      // 默认保存页面根节点位置
      pageScroller.push('.' + this.pageClass)

      // 添加全局的滚动元素配置
      // 组件外部选择器使用 $ 前缀区分
      if (this.pageScroller) {
        pageScroller.push('$' + this.pageScroller)
      }

      // 记录位置
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

    // 还原滚动位置
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

    // 重置全局滚动位置
    resetScrollPosition() {
      if (!this.pageScroller) return

      const el = this.getScroller('$' + this.pageScroller)

      if (!el) return

      el.scrollLeft = 0
      el.scrollTop = 0
    },

    // 页面数据加载成功
    async onPageLoaded() {
      await this.$nextTick()
      // 页面数据加载成功后还原滚动位置
      this.restoreScrollPosition()
    }
  }
}
</script>

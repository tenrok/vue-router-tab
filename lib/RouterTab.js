// Method
import { emptyObj, prunePath, getTransOpt } from './util'

// Function module mixin
import contextmenu from './mixins/contextmenu'
import i18n from './mixins/i18n'
import iframe from './mixins/iframe'
import operate from './mixins/operate'
import pageLeave from './mixins/pageLeave'
import scroll from './mixins/scroll'
import restore from './mixins/restore'

// Child components
import RouterAlive from './components/RouterAlive.vue'
import TabItem from './components/TabItem'
import TabScroll from './components/TabScroll.vue'
import TabContextmenu from './components/Contextmenu.vue'

// RouterTab coomponent
// @vue/component
const RouterTab = {
  name: 'RouterTab',

  components: { RouterAlive, TabItem, TabScroll, TabContextmenu },

  mixins: [contextmenu, i18n, iframe, operate, pageLeave, scroll, restore],

  // Inject child components
  provide() {
    return {
      $tabs: this,
      allowDragPinned: this.allowDragPinned,
      allowClosePinned: this.allowClosePinned,
      hideTitlePinned: this.hideTitlePinned,
      onTabEvent: this.onTabEvent
    }
  },

  props: {
    // Allow pinned group
    allowPin: {
      type: Boolean,
      default: false
    },

    // Allow drag the pinned tab
    allowDragPinned: {
      type: Boolean,
      default: true
    },

    // Allow close the pinned tab
    allowClosePinned: {
      type: Boolean,
      default: true
    },

    // Hide the title of pinned tab
    hideTitlePinned: {
      type: Boolean,
      default: false
    },

    // Allow setting up links between tabs
    useInheritance: {
      type: Boolean,
      default: false
    },

    // Initial tab data
    tabs: {
      type: Array,
      default: () => []
    },

    // Whether to restore tabs after page refresh
    restore: {
      type: [Boolean, String],
      default: false
    },

    // Whether to monitor "restoreKey" changes and automatically restore the tab
    restoreWatch: {
      type: Boolean,
      default: false
    },

    // Page scroll element selector
    pageScroller: {
      type: String,
      default: '.router-tab__container'
    },

    // Default page
    defaultPage: [String, Object],

    // Tab transition effect
    tabTransition: {
      type: [String, Object],
      default: 'router-tab-zoom'
    },

    // Page transition effect
    pageTransition: {
      type: [String, Object],
      default: () => ({
        name: 'router-tab-swap',
        mode: 'out-in'
      })
    },

    /**
     * Customize the context menu
     * 1. Disable when "false"
     * 2. The context menu can be customized when it is an array
     */
    contextmenu: {
      type: [Boolean, Array],
      default: true
    },

    contextmenuPinned: {
      type: Array,
      default: () => []
    },

    // Whether to support tab drag and drop sorting
    dragsort: {
      type: Boolean,
      default: true
    },

    // New tab insertion position, "last" end, "next" next
    append: {
      type: String,
      default: 'last'
    },

    // Whether to keep the last tab from being closed
    keepLastTab: {
      type: Boolean,
      default: true
    },

    // Whether to cache by default, it can be reset by routing "meta.keepAlive"
    keepAlive: {
      type: Boolean,
      default: true
    },

    // Maximum number of caches, 0 is unlimited
    maxAlive: {
      type: Number,
      default: 0
    },

    // Whether to reuse routing components, which can be reset by routing "meta.reuse"
    reuse: {
      type: Boolean,
      default: false
    },

    // Tab internationalization configuration i18n (key, [args])
    i18n: Function,

    /**
     * Component language
     * - When it is a string, optional values: 'zh'-Chinese, 'en'-English
     * - When it is an object, you can set a custom language
     * - Default: 'auto'. Component language is automatically recognized based on browser language.
     */
    lang: {
      type: [String, Object],
      default: 'auto'
    }
  },

  data() {
    return {
      items: [], // Tab items
      onDragSort: false, // Drag and drop sorting
      aliveReady: false // RouterAlive initialization
    }
  },

  computed: {
    pinnedGroup() {
      return this.items.filter(tab => tab.pinned)
    },

    commonGroup() {
      return this.items.filter(tab => !tab.pinned)
    },

    // routerAlive
    $alive() {
      return this.aliveReady ? this.$refs.routerAlive : null
    },

    // 当前激活的页签 id
    activeTabId() {
      return this.$alive ? this.$alive.key : null
    },

    // 当前激活的页签索引
    activeTabIndex() {
      return this.items.findIndex(item => item.id === this.activeTabId)
    },

    // 当前激活的页签
    activeTab() {
      return this.items[this.activeTabIndex]
    },

    // 根路径
    basePath() {
      return this.$alive ? this.$alive.basePath : '/'
    },

    // 默认路径
    defaultPath() {
      return this.defaultPage || this.basePath || '/'
    },

    // 页签过渡
    tabTrans() {
      return getTransOpt(this.tabTransition)
    },

    // 页面过渡
    pageTrans() {
      return getTransOpt(this.pageTransition)
    }
  },

  created() {
    // 添加到原型链
    RouterTab.Vue.prototype.$tabs = this
  },

  destroyed() {
    const proto = RouterTab.Vue.prototype
    // 取消原型挂载
    if (proto.$tabs === this) {
      proto.$tabs = null
    }
  },

  methods: {
    // RouterAlive 组件就绪
    onAliveReady($alive) {
      // 获取 keepAlive 组件实例
      this.$refs.routerAlive = $alive
      this.aliveReady = true
      this.initTabs()
    },

    // 初始页签数据
    initTabs() {
      if (this.restoreTabs()) return

      this.presetTabs()
    },

    // 预设页签
    presetTabs(tabs = this.tabs) {
      let ids = {}

      this.items = tabs
        .map(item => {
          item = typeof item === 'string' ? { to: item } : item || emptyObj

          const matched = item.to && this.matchRoute(item.to)

          if (matched) {
            const tab = this.getRouteTab(matched)
            const id = tab.id

            // 根据 id 去重
            if (!ids[id]) {
              // id 不允许更改
              delete item.id
              //console.log((ids[id] = Object.assign(tab, item)))
              // 初始 tab 数据
              return (ids[id] = Object.assign(tab, item))
            }
          }
        })
        .filter(item => !!item)
      //console.log(this.items)
    },

    // RouterAlive 缓存更新时同步更改页签
    onAliveChange(type, matched) {
      const { items, lastMatchedKey } = this
      const { key } = matched
      const matchIdx = items.findIndex(({ id }) => id === key)
      const item = this.getRouteTab(matched)

      // 页签已存在
      if (matchIdx > -1) {
        if (
          type === 'create' || // 创建缓存
          (type === 'update' && items[matchIdx].to !== matched.$route.fullPath) // 更新缓存且地址更改
        ) {
          this.$set(
            items,
            matchIdx,
            Object.assign(
              items.find(({ id }) => id === key),
              item
            )
          )
        }
      } else {
        // 新增页签
        if (this.append === 'next' && lastMatchedKey !== undefined) {
          const lastIndex = this.items.findIndex(
            item => item.id === lastMatchedKey
          )
          items.splice(lastIndex + 1, 0, item)
        } else {
          items.push(item)
        }
      }

      // 上次缓存 key
      this.lastMatchedKey = key
    },

    // Get tab configuration from route
    getRouteTab({ key, $route, meta }) {
      const tab = { ...meta }

      // Supports tab properties returned by routing functions
      const props = ['title', 'tips', 'icon', 'closable', 'nodrag', 'pinned']

      for (let i in tab) {
        if (props.includes(i)) {
          const val = tab[i]
          if (typeof val === 'function') {
            tab[i] = val($route)
          }
        }
      }

      return Object.assign(tab, {
        id: key,
        to: $route.fullPath
      })
    },

    // Reload route view
    async reload() {
      this.$alive.reload()
    },

    // Match routing information
    matchRoute($route) {
      return this.$alive.matchRoute($route)
    },

    // Get route cache key
    getRouteKey(route = this.$route) {
      return this.matchRoute(route).key
    },

    // 从路由地址匹配页签 id
    getIdByPath(path, match = true) {
      if (!path) return

      const matched = this.matchRoute(path)
      const { key } = matched

      if (match) {
        // 路由地址精确匹配页签
        const matchTab = this.items.find(
          ({ to }) => prunePath(to) === prunePath(matched.$route.fullPath)
        )

        if (matchTab) {
          return key
        }
      }

      return key
    },

    // Emit tab events
    onTabEvent(type, data) {
      this.$emit(`on-${type}`, data)
    }
  }
}

export default RouterTab

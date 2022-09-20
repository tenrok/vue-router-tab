import { mapGetters } from '../util'

// 拖拽传输数据前缀
const TRANSFER_PREFIX = 'RouterTabDragSortIndex:'

// 排序拖拽数据
// 用以解决双核浏览器兼容模式下无法通过 dataTransfer.getData 获取数据
let dragSortData = null

// 页签项
// @vue/component
export default {
  name: 'TabItem',

  inject: ['$tabs', 'allowDragPinned', 'allowClosePinned', 'hideTitlePinned'],

  props: {
    // 页签原始数据，方便 slot 插槽自定义数据
    data: {
      type: Object,
      required: true
    },

    // 页签项索引
    index: Number
  },

  data() {
    return {
      onDragSort: false, // 是否正在拖拽
      isDragOver: false // 是否拖拽经过
    }
  },

  computed: {
    // 从 this.data 提取计算属性
    ...mapGetters('data', [
      'id',
      'to',
      'icon',
      'tabClass',
      'target',
      'href',
      'nodrag',
      'pinned'
    ]),

    // class
    classList() {
      return [
        'router-tab__item',
        this.tabClass,
        {
          'is-active': this.$tabs.activeTabId === this.id,
          'is-closable': this.closable,
          'is-contextmenu': this.$tabs.contextData.id === this.id,
          'is-drag-over': this.isDragOver && !this.onDragSort
        }
      ]
    },

    // 国际化
    i18nText() {
      return this.$tabs.i18nText
    },

    // 未命名页签
    untitled() {
      return this.$tabs.langs.tab.untitled
    },

    // 页签标题
    title() {
      return this.i18nText(this.data.title) || this.untitled
    },

    // 页签提示
    tips() {
      return this.i18nText(this.data.tips || this.data.title) || this.untitled
    },

    // 是否可关闭
    closable() {
      const { keepLastTab, items } = this.$tabs
      return (
        (this.pinned ? this.allowClosePinned : true) &&
        this.data.closable !== false &&
        !(keepLastTab && items.length < 2)
      )
    },

    unpinnable() {
      return this.data.unpinnable != false ? true : false
    }
  },

  methods: {
    slotTitle() {
      const { title } = this.$tabs.$scopedSlots
      return title ? (
        title(this)
      ) : (
        <span class="router-tab__item-title" title={this.tips}>
          {this.title}
        </span>
      )
    },

    // Slot default content
    slotDefault() {
      const spanTitle =
        this.pinned && this.hideTitlePinned ? null : this.slotTitle()

      return [
        this.icon && <i class={['router-tab__item-icon', this.icon]} />,
        spanTitle,
        this.closable && (
          <i
            class="router-tab__item-close"
            vOn:click_prevent_stop={this.close}
          />
        )
      ]
    },

    // 关闭当前页签
    close() {
      this.$tabs.closeTab(this.id)
    },

    // 拖拽
    onDragStart(e) {
      this.onDragSort = this.$tabs.onDragSort = true
      dragSortData = TRANSFER_PREFIX + this.index
      e.dataTransfer.setData('text', dragSortData)
      e.dataTransfer.effectAllowed = 'all'
    },

    // 拖拽悬浮
    onDragOver(e) {
      const { items } = this.$tabs
      const raw = e.dataTransfer.getData('text') || dragSortData

      this.isDragOver = false

      if (typeof raw !== 'string' || !raw.startsWith(TRANSFER_PREFIX)) return

      const fromIndex = raw.replace(TRANSFER_PREFIX, '')
      const tab = items[fromIndex]
      this.isDragOver = true
      this.nodrag || tab.pinned !== this.pinned
        ? (e.dataTransfer.dropEffect = 'none')
        : (e.dataTransfer.dropEffect = 'move')
    },

    // 拖拽结束
    onDragEnd() {
      this.onDragSort = this.$tabs.onDragSort = false
      dragSortData = null
    },

    // 释放后排序
    onDrop(e) {
      const { items } = this.$tabs
      const raw = e.dataTransfer.getData('text') || dragSortData

      this.isDragOver = false

      if (typeof raw !== 'string' || !raw.startsWith(TRANSFER_PREFIX)) return

      const fromIndex = raw.replace(TRANSFER_PREFIX, '')
      const tab = items[fromIndex]
      if (tab.pinned === this.pinned) {
        items.splice(fromIndex, 1)
        items.splice(this.index, 0, tab)
      }
    }
  },

  // Render component
  // Use jsx render mode to replace template to avoid errors caused by Vue 2.5.22 version that does not support child components to use the parent component's slot.
  render() {
    const { default: slot = this.slotDefault } = this.$tabs.$scopedSlots

    return (
      <RouterLink
        custom
        to={this.to}
        scopedSlots={{
          default: ({ navigate }) => {
            return (
              <li
                class={this.classList}
                draggable={
                  this.$tabs.dragsort &&
                  !this.nodrag &&
                  (this.pinned ? this.allowDragPinned : true)
                }
                vOn:click={navigate}
                vOn:dragstart={!this.nodrag && this.onDragStart}
                vOn:dragend={!this.nodrag && this.onDragEnd}
                vOn:dragover_prevent={this.onDragOver}
                vOn:dragleave_prevent={() => (this.isDragOver = false)}
                vOn:drop_stop_prevent={!this.nodrag && this.onDrop}
                vOn:click_middle={() =>
                  this.closable &&
                  (this.pinned ? this.allowClosePinned : true) &&
                  this.close()
                }
              >
                {slot(this)}
              </li>
            )
          }
        }}
      ></RouterLink>
    )
  }
}

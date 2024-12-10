<script>
  import { mapGetters } from '../util'

  // Drag transfer data prefix
  const TRANSFER_PREFIX = 'RouterTabDragSortIndex:'

  // Sort drag data
  // To solve the problem that data cannot be obtained through dataTransfer.getData in dual-core browser compatibility mode
  let dragSortData = null

  // Tab Item
  // @vue/component
  export default {
    name: 'TabItem',

    inject: ['$tabs', 'allowDragPinned', 'allowClosePinned', 'hideTitlePinned'],

    props: {
      // Original data of the tab, convenient for slot to customize data
      data: {
        type: Object,
        required: true
      },

      // Tab item index
      index: Number
    },

    data() {
      return {
        onDragSort: false, // Is dragging in progress?
        isDragOver: false // Whether to drag through
      }
    },

    computed: {
      // Extract computed properties from this.data
      ...mapGetters('data', ['id', 'to', 'icon', 'tabClass', 'target', 'href', 'nodrag', 'pinned']),

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

      // Internationalization
      i18nText() {
        return this.$tabs.i18nText
      },

      // Untitled tab
      untitled() {
        return this.$tabs.langs.tab.untitled
      },

      // Tab title
      title() {
        return this.i18nText(this.data.title) || this.untitled
      },

      // Tab tips
      tips() {
        return this.i18nText(this.data.tips || this.data.title) || this.untitled
      },

      // Can it be closed?
      closable() {
        const { keepLastTab, items } = this.$tabs
        return (this.pinned ? this.allowClosePinned : true) && this.data.closable !== false && !(keepLastTab && items.length < 2)
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
          <span
            class="router-tab__item-title"
            title={this.tips}
          >
            {this.title}
          </span>
        )
      },

      // Slot default content
      slotDefault() {
        const spanTitle = this.pinned && this.hideTitlePinned ? null : this.slotTitle()

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

      // Close current tab
      close() {
        this.$tabs.closeTab(this.id)
      },

      // Drag
      onDragStart(e) {
        this.onDragSort = this.$tabs.onDragSort = true
        dragSortData = TRANSFER_PREFIX + this.index
        e.dataTransfer.setData('text', dragSortData)
        e.dataTransfer.effectAllowed = 'all'
      },

      // Drag and drop
      onDragOver(e) {
        const { items } = this.$tabs
        const raw = e.dataTransfer.getData('text') || dragSortData

        this.isDragOver = false

        if (typeof raw !== 'string' || !raw.startsWith(TRANSFER_PREFIX)) return

        const fromIndex = raw.replace(TRANSFER_PREFIX, '')
        const tab = items[fromIndex]

        this.isDragOver = true

        if (this.nodrag || tab.pinned !== this.pinned) {
          e.dataTransfer.dropEffect = 'none'
        } else {
          e.dataTransfer.dropEffect = 'move'
        }
      },

      // Drag ends
      onDragEnd() {
        this.onDragSort = this.$tabs.onDragSort = false
        dragSortData = null
      },

      // Sort by release
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
                  draggable={this.$tabs.dragsort && !this.nodrag && (this.pinned ? this.allowDragPinned : true)}
                  vOn:click={navigate}
                  vOn:dragstart={!this.nodrag && this.onDragStart}
                  vOn:dragend={!this.nodrag && this.onDragEnd}
                  vOn:dragover_prevent={this.onDragOver}
                  vOn:dragleave_prevent={() => (this.isDragOver = false)}
                  vOn:drop_stop_prevent={!this.nodrag && this.onDrop}
                  vOn:click_middle={() => this.closable && (this.pinned ? this.allowClosePinned : true) && this.close()}
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
</script>

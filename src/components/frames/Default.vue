<template>
  <router-tab
    :contextmenu="contextMenu"
    :contextmenu-pinned="contextMenuPinned"
    :on-drop-alive="onDropAlive"
    :on-pin="onPinHandler"
    :on-unpin="onUnpinHandler"
    use-inheritance
    :tabs="tabs"
    allow-pin
    :allow-close-pinned="false"
    hide-title-pinned
    ><template #divider><div class="pin-divider"></div></template>
  </router-tab>
</template>

<script>
export default {
  name: 'Default',

  data() {
    return {
      contextMenu: [
        { id: 'refresh', icon: 'fas fa-sync-alt' },
        'refreshAll',
        { id: 'close', icon: 'fas fa-times' },
        'closeLefts',
        'closeRights',
        'closeOthers',
        'pin',
        {
          id: 'inWindow',
          title: 'В новом окне',
          icon: 'fas fa-external-link-alt',

          handler(context) {
            alert(context)
          }
        }
      ],

      contextMenuPinned: [
        { id: 'refresh', icon: 'fas fa-sync-alt' },
        'refreshAll',
        { id: 'close', icon: 'fas fa-times' },
        { id: 'unpin', icon: 'fa-solid fa-thumbtack' },
        {
          id: 'inWindow',
          title: 'В новом окне',
          icon: 'fas fa-external-link-alt',
          enable(context) {
            return /^\/document|manager|service\d*\//.test(context.data.id)
          },

          handler(context) {
            context.$tabs.close(context.data.id)
            context.target.$open(`/x${context.data.id}`)
          }
        }
      ],

      tabs: [
        '/default/page/1',
        {
          to: '/default/page/2',
          title: 'kavo',
          pinned: true,
          nodrag: true,
          unpinnable: false,
          closable: false
        }
      ],

      onDropAlive(context) {
        console.log(context)
      },

      onPinHandler(context) {
        console.log('pin', context)
      },

      onUnpinHandler(context) {
        console.log('unpin', context)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pin-divider {
  top: 0;
  bottom: 0;
  background: grey;
  width: 3px;
  margin: 2px;
}

.router-tab__slot-divider_trans-enter-active,
.router-tab__slot-divider_trans-leave-active {
  transition: opacity 0.5s ease-in-out;
}
.router-tab__slot-divider_trans-enter-from,
.router-tab__slot-divider_trans-leave-to {
  opacity: 0;
}
</style>

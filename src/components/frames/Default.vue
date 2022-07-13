<template>
  <router-tab
    :contextmenu="contextMenu"
    :contextmenu-pinned="contextMenuPinned"
    :on-drop-alive="onDropAlive"
    :use-inheritance="true"
    :tabs="tabs"
    allow-pin
    ><template #divider><div class="pin-divider">|</div></template>
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
          unpinnable: false,
          closable: false
        }
      ],

      onDropAlive(context) {
        //console.log(context)
      }
    }
  }
}
</script>

<style scoped>
.pin-divider {
  margin: auto;
}
</style>

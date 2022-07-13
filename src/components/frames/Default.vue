<template>
  <router-tab
    :contextmenu="contextMenu"
    :on-drop-alive="onDropAlive"
    :use-inheritance="true"
    :tabs="tabs"
    allow-pin
  />
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

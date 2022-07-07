<template>
  <router-tab
    :contextmenu="contextMenu"
    :on-drop-alive="onDropAlive"
    :use-inheritance="true"
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
        {
          id: 'inWindow',
          title: 'В новом окне',
          icon: 'fas fa-external-link-alt',

          handler(context) {
            alert(context)
          }
        }
      ],

      onDropAlive(context) {
        console.log(context)
      }
    }
  }
}
</script>

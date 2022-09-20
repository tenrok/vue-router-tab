<template>
  <a
    v-if="visible"
    class="router-tab__contextmenu-item"
    :class="menuClass"
    :data-action="id"
    :disabled="!enable"
    :title="tips"
    @click="enable && data.handler(context)"
  >
    <i v-if="icon" class="router-tab__contextmenu-icon" :class="icon"></i>
    {{ title }}
  </a>
</template>

<script>
import { mapGetters } from '../util'

export default {
  name: 'ContextmenuItem',

  inject: ['$tabs', 'onTabEvent'],

  props: {
    // Menu data
    data: {
      type: Object,
      required: true
    }
  },

  computed: {
    // Parameters
    context() {
      const { $tabs, $parent: $menu, onTabEvent } = this
      const { target, data } = $menu
      return { $tabs, $menu, target, data, onTabEvent }
    },

    // 从 this.data 提取计算属性
    ...mapGetters(
      'data',
      {
        id: '',
        // 菜单标题
        title() {
          return this.$tabs.langs.contextmenu[this.id]
        },
        icon: '',
        tips: '',
        class: {
          default: '',
          alias: 'menuClass'
        },
        visible: true, // 是否显示
        enable: true // 是否启用
      },
      'context'
    )
  }
}
</script>

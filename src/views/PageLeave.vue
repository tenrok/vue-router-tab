<template>
  <div>
    <h2>Page exit confirmation</h2>

    <page-timer />

    <p>The page will confirm the prompt when the tab is closed/refreshed/replaced.</p>

    <p>
      <a class="demo-btn" @click="$tabs.refresh(null, true, false)">Refresh tab</a>

      <a class="demo-btn" @click="$tabs.close({ force: false })">Close tab</a>

      <router-link class="demo-btn" :to="`?id=${+($route.query.id || 0) + 1}`">Replace tab</router-link>

      <router-link class="demo-btn" to="/default/page/1">Leave route</router-link>

      <a class="demo-btn" @click="reload">Refresh browser</a>
    </p>
  </div>
</template>

<script>
import PageTimer from '../components/PageTimer'

export default {
  name: 'PageLeave',

  components: { PageTimer },

  /**
   * Confirm before leaving the page
   * @param {Object} tab tab information
   * @param {String} type leaving type:
   *   close: close tab
   *   refresh: refresh tab
   *   replace: replace tab
   *   leave: route leaves
   *   unload: browser refresh or close
   * @returns {String|Promise}
   */
  beforePageLeave(tab, type) {
    // Supported browsers will display a confirmation message when the browser window is refreshed or closed.
    if (type === 'unload') {
      return `Your changes on the "${tab.title}" tab have not been completed. Do you want to leave?`
    }

    // Leave type
    const action = {
      close: 'close',
      refresh: 'refresh',
      replace: 'replace',
      leave: 'leave'
    }[type]

    const msg = `您确认要${action}页签“${tab.title}”吗？`

    // Return promise, resolve to leave, reject to prevent leaving
    return new Promise((resolve, reject) => {
      // Confirm prompt if value changes
      if (confirm(msg)) {
        resolve()
      } else {
        reject(`You rejected to ${action} tab`)
      }
    })

    // 此处使用了 Element 的 confirm 组件
    // 需将 closeOnHashChange 配置为 false，以避免路由切换导致确认框关闭
    // return this.$confirm(msg, '提示', { closeOnHashChange: false })
  },

  methods: {
    // Browser refresh
    reload() {
      location.reload()
    }
  }
}
</script>

// 菜单数据
const menuMap = {
  // 刷新
  refresh: {
    handler({ data, $tabs }) {
      $tabs.refreshTab(data.id)
    }
  },

  // 刷新全部
  refreshAll: {
    handler({ $tabs }) {
      $tabs.refreshAll()
    }
  },

  // 关闭
  close: {
    enable({ target }) {
      return target.closable
    },
    handler({ data, $tabs }) {
      $tabs.closeTab(data.id)
    }
  },

  // send tab to pinned group
  pin: {
    enable({ $tabs }) {
      return $tabs.allowPin
    },
    handler({ data, $tabs, $oph }) {
      const item = $tabs.items.find(
        el => el.id === data.id || el.to === data.id
      )
      item.pinned = true

      // push tab to the end of items
      $tabs.items.splice($tabs.items.indexOf(item), 1)
      $tabs.items.push(item)

      $oph && $oph({ data: item, $tabs })
    }
  },

  // send tab to common group
  unpin: {
    enable({ target }) {
      return target.unpinnable
    },
    handler({ data, $tabs, $ouh }) {
      const item = $tabs.items.find(
        el => el.id === data.id || el.to === data.id
      )
      item.pinned = false

      // push tab to the end of items
      $tabs.items.splice($tabs.items.indexOf(item), 1)
      $tabs.items.push(item)

      $ouh && $ouh({ data: item, $tabs })
    }
  },

  // 关闭左侧
  closeLefts: {
    enable({ $menu }) {
      return $menu.lefts.length
    },
    handler({ $menu }) {
      $menu.closeMulti($menu.lefts)
    }
  },

  // 关闭右侧
  closeRights: {
    enable({ $menu }) {
      return $menu.rights.length
    },
    handler({ $menu }) {
      $menu.closeMulti($menu.rights)
    }
  },

  // 关闭其他
  closeOthers: {
    enable({ $menu }) {
      return $menu.others.length
    },
    handler({ $menu }) {
      $menu.closeMulti($menu.others)
    }
  }
}

// 遍历填充 id
Object.entries(menuMap).forEach(([id, item]) => (item.id = id))

export default menuMap

// 默认菜单
export const defaultMenu = [
  'refresh',
  'refreshAll',
  'close',
  'closeLefts',
  'closeRights',
  'closeOthers',
  'pin'
]

export const defaultMenuPinned = ['refresh', 'close', 'unpin']

<template>
  <div class="app-ct" :class="{ 'sidebar-open': sidebarOpen }">
    <app-header @sidebar-change="sidebarOpen = !sidebarOpen" />

    <div class="app-bd">
      <div class="app-sd-mask" @click="sidebarOpen = false" />
      <app-aside />
      <main class="app-main">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import AppAside from './components/AppAside.vue'

export default {
  name: 'App',
  components: { AppHeader, AppAside },
  data() {
    return {
      sidebarOpen: false
    }
  },

  watch: {
    // Routing switch
    $route() {
      // Close sidebar
      this.sidebarOpen = false
    }
  }
}
</script>

<style lang="scss" scoped>
$side-width: 270px;
$just-trans: all 0.2s ease-in-out;

/* Layout */
.app-ct {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .app-sd {
    width: $side-width;
    transition: $just-trans;

    @include screen-mob {
      left: -$side-width;
    }
  }

  .app-bd {
    position: relative;
    flex: 1;
  }
}

.sidebar-open {
  @include screen-mob {
    .app-sd-mask {
      display: block;
    }

    .app-sd {
      left: 0;
    }
  }
}

.app-sd-mask,
.app-sd {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  height: 100%;
}

.app-sd-mask {
  display: none;
  width: 100%;
}

.app-main {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: $side-width;
  height: 100%;
  transition: $just-trans;

  @include screen-mob {
    left: 0;
  }

  ::v-deep .router-tab {
    height: 100%;

    // Routing page
    &-page {
      padding: 15px;
      font-size: 14px;
      line-height: 1.5;
    }
  }
}
</style>

<style lang="scss" src="./assets/scss/demo.scss"></style>

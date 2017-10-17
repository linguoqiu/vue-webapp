<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <!-- 跳转动画 -->
    <transition name="anim" mode="out-in">
      <!-- 缓存页面，来换跳转的时候不用重新渲染 -->
      <keep-alive>
        <!-- 子页面在此标签下渲染 -->
        <router-view></router-view>
      </keep-alive>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from './components/m-header/m-header'
import Tab from 'components/tab/tab'

export default {
  name: 'app',
  components: {
    MHeader,
    Tab
  }
}
</script>

<style scoped lang="scss">
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(50px, 0);
  transform: translate(50px, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-50px, 0);
  transform: translate(-50px, 0);
}

.anim-enter-active,
.anim-leave-active {
  transition: opacity .4s ease;
}

.anim-enter,
.anim-leave-active {
  opacity: 0;
}
</style>

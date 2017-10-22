<template>
    <!-- 跳转到子页面的动画 -->
    <transition name="slide">
        <div class="singer-detail"></div>
    </transition>
</template>

<script type="text/ecmascript-6">
export default {

}
</script>

<style lang="scss" scoped>
@import "../../common/stylus/variable.scss";

.singer-detail {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-background;
}

.slide-enter-active,.slide-leave-active{
    transition: all 0.3s;
}

.slider-enter,.slide-leave-to{
    transform: translate3d(100%,0,0);
}
</style>



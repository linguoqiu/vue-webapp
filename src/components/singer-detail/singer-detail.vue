<template>
    <!-- 跳转到子页面的动画 -->
    <transition name="slide">
        <div class="singer-detail"></div>
    </transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
import { getSingerDetail } from 'api/singer'
import { ERR_OK } from 'api/config'

export default {
    computed: {
        // 映射 `this.singer` 为 `store.getters.singer`
        ...mapGetters([
            'singer'
        ])
    },
    created() {
        this._getDetail()
    },
    methods: {
        _getDetail() {
            // 如果singer.id为空，则返回上一页，防止在歌手页面刷新导致异常
            if (!this.singer.id) {
                this.$router.push('/singer')
                return
            }
            getSingerDetail(this.singer.id).then((res) => {
                if (res.code === ERR_OK) {
                    console.log(res)
                }
            })
        }
    }
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}

.slider-enter,
.slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>



<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
      <div class="bar-inner">
          <div class="progress" ref="progress"></div>
          <div  class="progress-btn-wrapper" ref="progressBtn"
            @touchstart.prevent="progressTouchStart"
            @touchmove.prevent="progressTouchMove"
            @touchend.prevent="progressTouchEnd"
          >
              <div class="progress-btn"></div>
          </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { prefixStyle } from 'common/js/dom'

const progressBtnWidth = 16
const transform = prefixStyle('transform')

export default {
    props: {
        percent: {
            type: Number,
            default: 0
        }
    },
    created() {
        this.touch = {}
    },
    watch: {
        // 实时计算进度条的宽度
        percent(newPercent) {
            // 满足 newPercent大于0,且不在拖动的情况下
            if (newPercent >= 0 && !this.touch.initiated) {
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
                const offsetWidth = newPercent * barWidth
                this._offset(offsetWidth)
            }
        }
    },
    methods: {
        progressTouchStart(e) {
            // 标志位，代表已经初始化
            this.touch.initiated = true
            // 移动的横向坐标
            this.touch.startX = e.touches[0].pageX
            // 当前按钮的width
            this.touch.left = this.$refs.progress.clientWidth
        },
        progressTouchMove(e) {
            // 如果没初始化，直接返回
            if (!this.touch.initiated) {
                return
            }
            // 计算移动的距离
            const deltaX = e.touches[0].pageX - this.touch.startX
            const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
            this._offset(offsetWidth)
        },
        progressTouchEnd(e) {
            this.touch.initiated = false
            this._triggerPercent()
        },
        progressClick(e) {
            this._offset(e.offsetX)
            this._triggerPercent()
        },
        // 设置偏移量
        _offset(offsetWidth) {
            // 进度条的偏移
            this.$refs.progress.style.width = `${offsetWidth}px`
            // 小球的偏移
            this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        },
        // 派发percent给业务组件
        _triggerPercent() {
            const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
            const percent = this.$refs.progress.clientWidth / barWidth
            this.$emit('percentChange', percent)
        }
    }
}
</script>

<style lang="scss" scoped>
@import "~common/stylus/variable";

.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>


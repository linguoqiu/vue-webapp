<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot>
            </slot>
        </div>
        <div class="dots">
            <span class="dot" v-for="(item , index) in dots" :class="{active: currentPageIndex === index}"></span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
    data() {
        return {
            dots: [],
            currentPageIndex: 0
        }
    },
    props: {
        loop: {
            type: Boolean,
            default: true
        },
        autoPlay: {
            type: Boolean,
            default: true
        },
        interval: {
            type: Number,
            default: 4000
        }
    },
    mounted() {
        // 浏览器刷新通常为17ms一次
        setTimeout(() => {
            this._setSlideWidth()
            this._iniDots()
            this._initSlider()

            if (this.autoPlay) {
                this._play()
            }
        }, 20)

        // resize，监听窗口改变事件
        window.addEventListener('resize', () => {
            if (!this.slider) {
                return
            }

            this._setSlideWidth(true)
            // 重新刷新计算宽度
            this.slider.refresh()
        })
    },
    methods: {
        // 计算sliders的宽度
        _setSlideWidth(isResize) {
            // 获取sliderGroup的子组件
            this.children = this.$refs.sliderGroup.children
            let width = 0
            // 获取slider的宽度
            let sliderWidth = this.$refs.slider.clientWidth
            // 为每个child定宽度，并添加slider-item类样式
            for (let i = 0; i < this.children.length; i++) {
                let child = this.children[i]
                addClass(child, 'slider-item')

                child.style.width = sliderWidth + 'px'
                width += sliderWidth
            }
            // 循环时，首尾各加一个slide，所以宽度要加 2 * sliderWidth
            if (this.loop && !isResize) {
                width += 2 * sliderWidth
            }
            this.$refs.sliderGroup.style.width = width + 'px'
        },
        _iniDots() {
            this.dots = new Array(this.children.length)
        },
        _initSlider() {
            // 初始化BScroll，新版本的snap是一个对象，包含loop，详细请github的better-scroll
            this.slider = new BScroll(this.$refs.slider, {
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: true,
                snapLoop: this.loop,
                snapThreshold: 0.3,
                snapSpeed: 400
            })

            // 监听slider的scrollEnd的事件
            this.slider.on('scrollEnd', () => {
                let pageIndex = this.slider.getCurrentPage().pageX
                // 如果循环，会在前后各浅复制有一个slide，所以要-1
                if (this.loop) {
                    pageIndex -= 1
                }
                this.currentPageIndex = pageIndex

                // 每次轮播前都手动清除一下定时器
                if (this.autoPlay) {
                    clearTimeout(this.timer)
                    this._play()
                }
            })
        },
        // 设置自动播放
        _play() {
            let pageIndex = this.currentPageIndex + 1
            // 如果循环，会在前后各浅复制有一个slide，所以要+1
            if (this.loop) {
                pageIndex += 1
            }
            this.timer = setTimeout(() => {
                // 调用slider.goToPage
                this.slider.goToPage(pageIndex, 0, 400)
            }, this.interval)
        }
    },
    destroyed() {
        clearTimeout(this.timer)
    }
}
</script>

<style scoped lang="scss">
@import "../../common/stylus/variable.scss";

.slider {
    min-height: 1px;
    .slider-group {
        position: relative;
        overflow: hidden;
        white-space: nowrap;
        .slider-item {
            float: left;
            box-sizing: border-box;
            overflow: hidden;
            text-align: center;
            a {
                display: block;
                width: 100%;
                overflow: hidden;
                text-decoration: none;
            }
            img {
                display: block;
                width: 100%;
            }
        }
    }
    .dots {
        position: absolute;
        right: 0;
        left: 0;
        bottom: 12px;
        text-align: center;
        font-size: 0;
        .dot {
            display: inline-block;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
                width: 20px;
                border-radius: 5px;
                background: $color-theme;
            }
        }
    }
}
</style>



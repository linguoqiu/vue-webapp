<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>


<script type='text/ecmascript-6'>
// 使用到了better-scroll插件
import BScroll from 'better-scroll'
export default {
    props: {
        probeType: {
            type: Number,
            default: 1
        },
        click: {
            type: Boolean,
            default: true
        },
        data: {
            type: Array,
            default: null
        },
        // 是否监听滚动
        listenScroll: {
            type: Boolean,
            default: false
        },
        pullup: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        setTimeout(() => {
            this._initScroll()
        }, 20)
    },
    methods: {
        _initScroll() {
            // 如果wrapper还未初始化完成的时候，直接返回
            if (!this.$refs.wrapper) {
                return
            }
            this.scroll = new BScroll(this.$refs.wrapper, {
                probeType: this.probeType,
                click: this.click
            })

            if (this.listenScroll) {
                // 保留此vue实例
                let me = this
                // 监听scroll事件，pos为位置
                this.scroll.on('scroll', (pos) => {
                    // 触发当前实例上的事件。附加参数都会传给监听器回调。
                    me.$emit('scroll', pos)
                })
            }

            // 如果又pullup，则处理
            if (this.pullup) {
                // 监听scrollEnd事件
                this.scroll.on('scrollEnd', () => {
                    // 拖动快到底部的时候
                    if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
                        this.$emit('scrollToEnd')
                    }
                })
            }
        },
        // enable，disable，refresh，scrollTo，scrollToElement 分别调用better-scroll上的方法
        enable() {
            this.scroll && this.scroll.enable()
        },
        disable() {
            this.scroll && this.scroll.disable()
        },
        refresh() {
            this.scroll && this.scroll.refresh()
        },
        scrollTo() {
            // apply将上下文绑定为this.scroll，要不然就是这个scroll的对象
            this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
        },
        scrollToElement() {
            this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        }
    },
    watch: {
        // 当data有变化的时候，20ms后就会重新refresh一次
        data() {
            setTimeout(() => {
                this.refresh()
            }, 20)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>


<template>
    <div ref="wrapper">
        <slot></slot>
    </div>
</template>


<script type='text/ecmascript-6'>
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
        },
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


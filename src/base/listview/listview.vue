<template>
    <scroll class="listview" :data='data' ref="listview" :listenScroll='listenScroll' :probeType='probeType' @scroll="scroll">
        <ul>
            <li v-for="group in data" class="list-group" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <ul>
                    <li v-for="item in group.items" class="list-group-item">
                        <img class="avatar" v-lazy="item.avatar">
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart='onShortcutTouchStart' @touchmove.stop.prevent="onShortcutTouchMove">
            <ul>
                <li v-for="(item, index) in shortcutList" class="item" :class="{'current': currentIndex === index}" :data-index="index">
                    {{item}}
                </li>
            </ul>
        </div>
    </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import { getData } from 'common/js/dom.js'

// 每个shortcut元素的高度
const ANCHOR_HEIGHT = 18

export default {
    created() {
        this.touch = {}
        this.listenScroll = true
        this.listHeight = []
        this.probeType = 3
    },
    data() {
        return {
            scrollY: -1,
            currentIndex: 0
        }
    },
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    computed: {
        // 根据this.data的数据，然后遍历this.data，得出tilte的简称（第一个字母）
        shortcutList() {
            return this.data.map((group) => {
                return group.title.substr(0, 1)
            })
        }
    },
    components: {
        Scroll
    },
    methods: {
        onShortcutTouchStart(e) {
            let anchorIndex = getData(e.target, 'index')
            let firstTouch = e.touches[0]
            this.touch.y1 = firstTouch.pageY
            // 记录touchstart在哪个字母上
            this.touch.anchorIndex = anchorIndex
            // scroll到listGroup[anchorIndex]的位置
            this._scrollTo(anchorIndex)
        },
        onShortcutTouchMove(e) {
            let firstTouch = e.touches[0]
            this.touch.y2 = firstTouch.pageY
            // | 0 为向下取整
            let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
            // 计算move到哪个字母上,this.touch.anchorIndex要转换为数字
            let anchorIndex = parseInt(this.touch.anchorIndex) + delta
            this._scrollTo(anchorIndex)
        },
        // scroll事件触发的函数
        scroll(pos) {
            this.scrollY = pos.y
        },
        _scrollTo(index) {
            // 第二个参数为滚动的时间，0为不需要动画
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
        },
        // 计算高度
        _calculateHeight() {
            this.listHeight = []
            // 获取listGroup
            const list = this.$refs.listGroup
            let height = 0
            // listHeight是存放每个item的高度（height）
            this.listHeight.push(height)
            for (let i = 0; i < list.length; i++) {
                let item = list[i]
                // item是dom对象，直接获取clientHeight
                height += item.clientHeight
                this.listHeight.push(height)
            }
        }
    },
    watch: {
        data() {
            setTimeout(() => {
                this._calculateHeight()
            }, 20)
        },
        // scrollY发生变化了就执行此方法，第一个参数为新值，第二个参数为旧值
        scrollY(newY) {
            const listHeight = this.listHeight
            // 当滚动到顶部时，newY> 0
            if (newY > 0) {
                this.currentIndex = 0
                return
            }
            // 当在中间滚动的时候
            // 判断newY落在listHeight数组的哪个区间内，如在此区间内，直接返回
            for (let i = 0; i < listHeight.length - 1; i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i + 1]
                if (!height2 || (-newY >= height1 && -newY < height2)) {
                    this.currentIndex = i
                    return
                }
            }
            // 当滚动到底部的时候，且-newY大于最后一个元素的上限
            this.currentIndex = listHeight.length - 2
        }
    }
}
</script>


<style lang="scss" scoped>
@import '../../common/stylus/variable.scss';

.listview {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    .list-group {
        padding-bottom: 30px;
        .list-group-title {
            height: 30px;
            line-height: 30px;
            padding-left: 20px;
            font-size: $font-size-small;
            color: $color-text-l;
            background: $color-highlight-background;
        }
        .list-group-item {
            display: flex;
            align-items: center;
            padding: 20px 0 0 30px;
            .avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
            }
            .name {
                margin-left: 20px;
                color: $color-text-l;
                font-size: $font-size-medium;
            }
        }
    }
    .list-shortcut {
        position: absolute;
        z-index: 30;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        padding: 20px 0;
        border-radius: 10px;
        text-align: center;
        background: $color-background-d;
        font-family: Helvetica;
        .item {
            padding: 3px;
            line-height: 1;
            color: $color-text-l;
            font-size: $font-size-small;
            &.current {
                color: $color-theme
            }
        }
        .list-fixed {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            .fixed-title {
                height: 30px;
                line-height: 30px;
                padding-left: 20px;
                font-size: $font-size-small;
                color: $color-text-l;
                background: $color-highlight-background;
            }
        }
        .loading-container {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>

<template>
    <scroll class="listview" :data='data' ref="listview">
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
                <li v-for="(item, index) in shortcutList" class="item" :data-index="index">
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
            // 计算move到哪个字母上
            let anchorIndex = this.touch.anchorIndex + delta
            this._scrollTo(anchorIndex)
        },
        _scrollTo(index) {
            this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
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

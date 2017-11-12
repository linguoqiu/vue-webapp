<template>
    <div class="recommend" ref="recommend">
        <div v-if="recommends.length" class="slider-wrapper">
            <slider>
                <div v-for="item in recommends">
                    <a :href="item.linkUrl">
                        <img :src="item.picUrl">
                    </a>
                </div>
            </slider>
        </div>
        <h1 class="list-title">热门歌单推荐</h1>
        <scroll class="recommend-content" :data='discList' ref="scroll">
            <div class="recommend-list">
                <ul>
                    <li v-for="item in discList" class="item">
                        <div class="icon">
                            <!-- v-lazy图片懒加载：使用了vue-lazy -->
                            <img width="60" height="60" v-lazy="item.imgurl">
                        </div>
                        <div class="text">
                            <h2 class="name" v-html="item.creator.name"></h2>
                            <p class="desc" v-html="item.dissname"></p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="loading-container" v-show="!discList.length">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import Slider from 'base/slider/slider'
import { getRecommend, getDiscList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { playlistMixin } from 'common/js/mixin'

export default {
    mixins: [playlistMixin],
    data() {
        return {
            recommends: [],
            discList: []
        }
    },
    created() {
        this._getRecommend()
        this._getDiscList()
    },
    components: {
        Slider,
        Scroll,
        Loading
    },
    methods: {
        handdlePlaylist(playlist) {
             const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.recommend.style.bottom = bottom
            this.$refs.scroll.refresh()
        },
        // 获取轮播图的资源：图片，连接等
        _getRecommend() {
            getRecommend().then((res) => {
                if (res.code === ERR_OK) {
                    this.recommends = res.data.slider
                }
            })
        },
        // 获取歌单的资源：图片，连接等
        _getDiscList() {
            getDiscList().then((res) => {
                if (res.code === ERR_OK) {
                    this.discList = res.data.list
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
@import "../../common/stylus/variable.scss";

.recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .slider-wrapper {
        position: relative;
        width: 100%;
        overflow: hidden;
    }
    .list-title {
        height: 60px;
        line-height: 60px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
    }
    .recommend-content {
        height: 65%;
        overflow: hidden;
        .recommend-list {
            .item {
                display: flex;
                box-sizing: border-box;
                align-items: center;
                padding: 0 20px 20px 20px;
                .icon {
                    flex: 0 0 60px;
                    width: 60px;
                    padding-right: 20px;
                }
                .text {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    flex: 1;
                    line-height: 20px;
                    overflow: hidden;
                    font-size: $font-size-medium;
                    .name {
                        margin-bottom: 10px;
                        color: $color-text;
                    }
                    .desc {
                        color: $color-text-d
                    }
                }
            }
        }
    }
    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
}
</style>

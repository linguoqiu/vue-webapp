<template>
    <scroll ref="suggest"
        class="suggest">
      <ul class="suggest-list">
          <li @click="select(item)" class="suggest-item" v-for="item in result">
              <div class="icon">
                  <i :class="getIconCls(item)"></i>
              </div>
              <div class="name">
                  <p class="text" v-html="getDisplayName(item)"></p>
              </div>
          </li>
          <!-- <loading v-show="hasMore" title=""></loading> -->
      </ul>
      <!-- <div v-show="!hasMore && !result.length" class="no-result-wrapper">
          <no-result title="抱歉，暂无搜索结果"></no-result>
      </div> -->
    </scroll>
</template>


<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { search } from 'api/search'
import { ERR_OK } from 'api/config'
import { filterSinger } from 'common/js/song'

const TYPE_SINGER = 'singer'

export default {
    props: {
        // 检索词
        query: {
            type: String,
            default: ''
        },
        showSinger: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            page: 1,
            result: []
        }
    },
    methods: {
        _search() {
            search(this.query, this.page, this.showSinger).then((res) => {
                if (res.code === ERR_OK) {
                    console.log(res)
                    this.result = this._genResult(res.data)
                }
            })
        },
        _genResult(data) {
            let ret = []
            //  先把zhida的数据推进ret
            if (data.zhida && data.zhida.singerid) {
                ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } })
            }
            if (data.song) {
                ret = ret.concat(data.song.list)
            }
            return ret
        },
        getIconCls(item) {
            if (item.type === TYPE_SINGER) {
                return 'icon-mine'
            } else {
                return 'icon-music'
            }
        },
        getDisplayName(item) {
            if (item.type === TYPE_SINGER) {
                return item.singername
            } else {
                return `${item.songname} - ${filterSinger(item.singer)}`
            }
        }
    },
    watch: {
        query() {
            this._search()
        }
    },
    components: {
        Scroll,
        Loading
    }
}
</script>


<style lang="scss" scoped>
@import "~common/stylus/variable";
@import "~common/stylus/mixin";

.suggest {
  height: 100%;
  overflow: hidden;
  .suggest-list {
    padding: 0 30px;
    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }
    .icon {
      flex: 0 0 30px;
      width: 30px;
      [class^="icon-"] {
        font-size: 14px;
        color: $color-text-d;
      }
    }
    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;
      .text {
        @include no-wrap();
      }
    }
  }
  .no-result-wrapper {
    position: absolute;
    widows: 100%;
    top: 58%;
    transform: translateY(-50%);
  }
}
</style>


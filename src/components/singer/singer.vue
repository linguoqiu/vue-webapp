<template>
    <div>
        <div class="singer" v-show="singers.length">
            <list-view :data="singers" @select='selectSinger'>
            </list-view>
        </div>
        <div class="loading-container" v-show="!singers.length">
            <loading></loading>
        </div>
        <!-- 二级路由 -->
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import Loading from 'base/loading/loading'
import { mapMutations } from 'vuex'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
    data() {
        return {
            singers: []
        }
    },
    created() {
        this._getSingerList()
    },
    components: {
        ListView,
        Loading
    },
    methods: {
        // 由listview组件发来的select事件的响应方法
        selectSinger(singer) {
            this.$router.push({
                path: `/singer/${singer.id}`
            })
            // 相当于 commit mutation 'singer'
            this.setSinger(singer)
        },
        // 请求歌手数据
        _getSingerList() {
            getSingerList().then((res) => {
                if (res.code === ERR_OK) {
                    this.singers = this._normalizeSinger(res.data.list)
                    // 获取到singers后，对singers进行分类处理
                    console.log(this.singers)
                }
            })
        },
        // 初始化歌手列表
        _normalizeSinger(list) {
            let map = {
                hot: {
                    title: HOT_NAME,
                    items: []
                }
            }
            // 将map的前10热门的存放在hot上，并将所有item归类到不同的a-z下
            list.forEach((item, index) => {
                if (index < HOT_SINGER_LEN) {
                    map.hot.items.push(new Singer({
                        id: item.Fsinger_mid,
                        name: item.Fsinger_name
                    }))
                }
                // 如果map下没map[key]，则添加一个
                const key = item.Findex
                if (!map[key]) {
                    map[key] = {
                        title: key,
                        items: []
                    }
                }
                // 推歌手到map[key]
                map[key].items.push(new Singer({
                    id: item.Fsinger_mid,
                    name: item.Fsinger_name
                }))
            })
            // 将无序的map转换为 有序的list
            let hot = []
            let ret = []
            for (let key in map) {
                let val = map[key]
                // 匹配a-z，A-Z其中一个字母
                if (val.title.match(/[a-zA-Z]/)) {
                    ret.push(val)
                } else if (val.title === HOT_NAME) {
                    hot.push(val)
                }
            }
            //  对ret数组进行排序
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            // concat()方法用于连接两个或多个数组。
            return hot.concat(ret)
        },
        ...mapMutations({
            setSinger: 'SET_SINGER'
        })
    }
}
</script>

<style scoped lang="scss">
@import "../../common/stylus/variable.scss";

.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}

.loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
</style>

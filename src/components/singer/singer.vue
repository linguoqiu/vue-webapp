<template>
    <div class="singer">
        <list-view :data="singers">

        </list-view>
    </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'

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
        ListView
    },
    methods: {
        _getSingerList() {
            getSingerList().then((res) => {
                if (res.code === ERR_OK) {
                    this.singers = this._normalizeSinger(res.data.list)
                    // 获取到singers后，对singers进行分类处理
                    console.log(this.singers)
                }
            })
        },
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
        }
    }
}
</script>

<style scoped lang="scss">
@import '../../common/stylus/variable.scss';

.singer {
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
}
</style>

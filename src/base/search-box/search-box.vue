<template>
  <div class="search-box">
      <i class="icon-search"></i>
      <input  class="box" v-model="query" :placeholder="placeholder">
      <i v-show="query" @click="clearQuery()" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import { debounce } from 'common/js/util'
export default {
    data() {
        return {
            query: ''
        }
    },
    props: {
        placeholder: {
            type: String,
            default: '搜索歌曲、歌手'
        }
    },
    methods: {
        clearQuery() {
            this.query = ''
        },
        // 提供设置搜索框的方法
        setQuery(query) {
            this.query = query
        }
    },
    created() {
        //  监听query变化，然后发送query事件给外部
        // debounce作用： 200ms内不会多次调用此事件
        this.$watch('query', debounce((newQuery) => {
            // 发送query事件
            console.log(newQuery)
            this.$emit('query', newQuery)
        }, 200))
    }
}
</script>

<style lang="scss" scoped>
@import "~common/stylus/variable";

.search-box {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-background;
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-background;
  }
}
</style>

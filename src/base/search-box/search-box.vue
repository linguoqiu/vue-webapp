<template>
  <div class="search-box">
      <i class="icon-search"></i>
      <input  class="box" v-model="query" :placeholder="placeholder">
      <i v-show="query" @click="clearQuery()" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
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
        }
    },
    created() {
        //  监听query变化，然后发送query事件给外部
        this.$watch('query', (newQuery) => {
            this.$emit('query', newQuery)
        })
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

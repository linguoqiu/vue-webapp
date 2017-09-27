<template>
    <div class="loading">
        <img width="200" height="200" src="./loading.gif">
    </div>
</template>

<script  type='text/ecmascript-6'>
export default {
    props: {
        title: {
            type: String,
            default: '正在载入...'
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../common/stylus/variable.scss';

.loading {
    width: 100%;
    text-align: center;
    .desc {
        line-height: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
    }
}
</style>



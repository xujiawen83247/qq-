<template>
    <div class="loading">
        <img src="../assets/loading.gif" />
        <p class="desc">{{title}}</p>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: '正在加载...'
            }
        }
    }
</script>

<style lang="less">
    .loading {
        text-align: center;
        .desc {
            line-height: 60px;
            font-size: 24px;
        }
    }
</style>

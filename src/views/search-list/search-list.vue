<template>
    <div class="search-list" v-show="searches.length">
        <transition-group tag="ul" name="list" class="search-history-list">
            <li class="search-history-item" v-for="(item, index) in searches" :key="index" @click="selectItem(item)">
                <span>{{item}}</span>
                <i class="iconfont icon-chuyidong" @click.stop="deleteOne(item)"></i>
            </li>
        </transition-group>
    </div>
</template>

<script>
    
    export default {
        props: {
            searches: {
                type: Array,
                default: []
            }
        },
        methods: {
            selectItem(item) {
                this.$emit('select', item)
            },
            deleteOne(item) {
                this.$emit('deleteOne', item)
            }
        },
    }
</script>

<style lang="less" scoped>
    .search-history-list {
        display: flex;
        flex-direction: column; 
        .search-history-item {
            display: flex;
            flex-direction: row;
            height: 100px;
            line-height: 100px;
            &.list-enter-active, &.list-leave-active {
                transition: all 0.1s;
            }
            &.list-enter, &.list-leave-to {
                height: 0;
            }
            span {
                flex: 1;
            }
            .icon-chuyidong {
                font-size: 40px;
            }
        }
    }
</style>

<template>
    <ul class="switches">
        <li class="switches-item"
         v-for="(item, index) in switches" 
         :key="index" 
         :class="{'active':currentIndex === index}" 
         @click="switchesItem(index)"
         >
            <span>{{item.name}}</span>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        switches: {
            type: Array,
            default: []
        },
        currentIndex: {
            type: Number,
            default: 0
        }
    },
    methods: {
        switchesItem(index) {
            this.$emit('switches', index)
        }
    },
}
</script>

<style lang="less" scoped>
    .switches {
        display: flex;
        align-items: center;
        
        border: 1px solid #fff;
        border-radius: 10px;
        width: 500px;
        .switches-item {
            flex: 1;
            padding: 18px;
            text-align: center;
            font-size: 30px;
            color: #fff;
            &.active {
                background: #fff;
                color: #000;
            }
        }
    }
</style>


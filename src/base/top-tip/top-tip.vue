<template>
    <transition name="drop">
         <div class="top-tip" v-show="showFlag" @click.stop="hide">
             <slot></slot>
         </div>
    </transition>
</template>

<script>
    export default {
        props: {
            delay: {
                type: Number,
                default: 2000
            }
        },
        data() {
            return {
                showFlag: false
            }
        },
        methods: {
            show() {
                this.showFlag = true
                clearTimeout(this.time)
                this.time = setTimeout(() => {
                    this.hide()
                }, this.delay)
            },
            hide() {
                this.showFlag = false
            },
        },
    }
</script>

<style lang="less" scoped>
    .top-tip {
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 50;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(000,000,000,0.5);
        &.drop-enter-active, &.drop-leave-active {
            transition: 0.3s;
        }
        &.drop-enter, &.drop-leave-top {
            transform: translate3d(0, -100%, 0);
        }
    }
</style>


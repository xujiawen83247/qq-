<template>
    <transition name="confirm-fade">
        <div class="confirm" v-show="showFlag">
            <div class="confirm-wrapper">
                <div class="confirm-content">
                    <p class="text">{{text}}</p>
                    <div class="operate">
                        <div class="operate-btn left" @click="cancel">{{cancelBtnText}}</div>
                        <div class="operate-btn" @click="confirm">{{confirmBtnText}}</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            text: {
                type: String,
                default: ''
            },
            confirmBtnText: {
                type: String,
                default: '确定'
            },
            cancelBtnText: {
                type: String,
                default: '取消'
            }
        },
        data() {
            return {
                showFlag: false,
            }
        },
        methods: {
            show() {
                this.showFlag = true
            },
            hidd() {
                this.showFlag = false
            },
            cancel() {
                this.hidd()
                this.$emit('cancel')
            },
            confirm() {
                this.hidd()
                this.$emit('confirm')
            },
        },
    }
</script>

<style lang="less" scoped>
    .confirm {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 10;
        background: rgba(0 , 0, 0, 0.3);
        .confirm-wrapper {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 11;
            .confirm-content {
                border-radius: 10px;
                width: 700px;
                background: #ccc;
                .text {
                    padding: 45px 30px;
                    text-align: center;
                    font-size: 50px;
                    color: #fff;
                }
                .operate {
                    display: flex;
                    align-items: center;
                    text-align: center;
                    font-size: 40px;
                    .operate-btn {
                        flex: 1;
                        border-top: 1px solid #000;
                        padding: 20px 0;
                        color: #fff;
                        &.left {
                            border-right: 1px solid #000;
                        }
                    }
                }
            }
        }
    }
    .confirm-fade-enter-active {
        animation: confirm-fadein 0.3s;
        .confirm-content {
            animation: confirm-zoom 0.3s;
        }
    }
    @keyframes confirm-fadein {
        0% {opacity: 0;}
        100% {opacity: 1}
    }
    @keyframes confirm-zoom {
        0% {transform: scale(0)}
        50% {transform: scale(1.1)}
        100% {transform: scale(1)}
    }
</style>


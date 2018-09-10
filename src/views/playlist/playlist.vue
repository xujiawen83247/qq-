<template>
    <transition name="list-fade">
        <div class="playlist" v-show="showFlag" @click="hide">
            <div class="list-wrapper" @click.stop>
                <div class="list-header">
                    <h3 class="title">
                        <i class="iconfont icon-shunxubofang"></i>
                        <span class="text">顺序播放</span>
                        <span class="clear" @click="showConfirm"><i class="iconfont icon-shanchu"></i></span>
                    </h3>
                </div>
                <scroll class="list-content" ref="listContent" :data="sequenceList">
                    <transition-group name="list" tag="ul">
                        <li class="item" ref="listItem" v-for="(item,index) in sequenceList" :key="item.id" @click="selectItem(item, index)">
                            <span class="text" :class="getCurren(item)">
                                {{item.name}}
                                <i class="current" :class="getCurrentIcon(item)"></i>
                            </span>
                            
                            <span class="clear" @click.stop="deleteOne(item)"><i class="iconfont icon-shanchu"></i></span>
                        </li>
                        
                    </transition-group>
                </scroll>
                <div class="list-operate">
                    <div class="add">
                        <i class="iconfont icon-ic_join_dialing_norm"></i>
                        <span class="text">添加歌曲到队列</span>
                    </div>
                </div>
                <div class="list-close" @click="hide">
                    <span>关闭</span>
                </div>
            </div>
            <confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空" @confirm="confirmClear"></confirm>
        </div>
    </transition>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex'
    import {playMode} from '@/js/config'
    import Scroll from '@/base/scroll/scroll'
    import Confirm from '@/base/confirm/confirm'

    export default {
        data() {
            return {
                showFlag: false,
            }
        },
        computed: {
            ...mapGetters([
                'sequenceList',
                'currentSong',
                'playlist',
                'mode',
            ])
        },
        methods: {
            show() {
                this.showFlag = true
                setTimeout(() => {
                    this.$refs.listContent.refresh()
                    this.scrollToCurrent(this.currentSong)
                }, 20)
            },
            hide() {
                this.showFlag = false
            },
            getCurrentIcon(item) {
                if (this.currentSong.id === item.id) {
                    return 'iconfont icon-bofang'
                }else {
                    return ''
                }
            },
            getCurren(item) {
                if (this.currentSong.id === item.id) {
                    return 'g'
                }else {
                    return ''
                }
            },
            selectItem(item, index) {
                if (this.mode === playMode.random) {
                    index = this.playlist.findIndex((song) => {
                        return song.id === item.id
                    })
                }
                this.setCurrentIndex(index)
                this.setPlayingState(true)
            },
            scrollToCurrent(current) {
                const index = this.sequenceList.findIndex((song) => {
                    return current.id === song.id
                })
                this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
            },
            deleteOne(item) {
                this.deleteSong(item)
                if (!this.playlist.length) {
                    this.hide()
                }
            },
            showConfirm() {
                this.$refs.confirm.show()
            },
            confirmClear() {
                this.deleteSongList()
                this.hide()
            },
            ...mapMutations({
                setCurrentIndex: 'SET_CURRENT_INDEX',
                setPlayingState: 'SET_PLAYING_STATE'
            }),
            ...mapActions([
                'deleteSong',
                'deleteSongList'
            ])
        },
        watch: {
            currentSong(newSong, oldSong) {
                if (!this.showFlag || newSong.id === oldSong.id) {
                    return
                }else {
                    this.scrollToCurrent(newSong)
                }
            }
        },
        components: {
            Scroll,
            Confirm,
        }
    }
</script>

<style lang="less" scoped>
    .playlist {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 100;
        background: rgba(0, 0, 0, 0.3);
        &.list-fade-enter-active, &.list-fade-leave-active {
            transition: opacity 0.3s;
            .list-wrapper {
                transition: 0.3s;
            }
        }
        &.list-fade-enter, &.list-fade-leave-to {
            opacity: 0;
            .list-wrapper {
                transform: translate3d(0, 100%, 0)
            }
        }
        .list-wrapper {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            background: 000;
            .list-header {
                position: relative;
                background: #1a212b;
                .title {
                    display: flex;
                    align-items: center;
                    padding: 0 70px 0 55px;
                    height: 144px;
                    .text {
                        flex: 1;
                        margin-left: 38px;
                        color: #fff;
                        font-size: 38px;
                    }
                    .iconfont {
                        font-size: 50px;
                    }
                }
            }
            .list-content {
                max-height: 930px;
                overflow: hidden;
                background: rgba( 26, 33, 43, 0.9);
                
                .item {
                    &.list-enter-active, &.list-leave-active {
                        transition: 0.1s linear;
                    }
                    &.list-enter, &.list-leave-to {
                        height: 0;
                    }
                    display: flex;
                    align-items: center;
                    border-top: 1px solid #ccc;
                    padding: 0 70px 0 50px;
                    height: 118px;
                    background: rgba( 26, 33, 43, 0.9);
                    .text {
                        flex: 1;
                    }
                    .iconfont {
                        font-size: 50px;
                    }
                }
                .current, {
                    color: #1a915b;
                }
                .g {
                    color: #31c37c;
                }
            }
            .list-operate {
                padding: 40px 0 30px 0;
                
                background: rgba( 26, 33, 43, 0.9);
                .add {
                    display: flex;
                    align-items: center;
                    border: 1px solid #ccc;
                    border-radius: 70px; 
                    padding: 10px 16px;
                    width: 380px;
                    margin: 0 auto;
                    font-size: 38px;
                    .iconfont {
                        font-size: 50px;
                    }
                }
            }
            .list-close {
                display: flex;
                align-items: center;
                height: 13.889vw;
                background: rgba( 26, 33, 43, 0.5);
                span {
                    width: 100%;
                    text-align: center;
                    font-size: 50px;
                    font-weight: 600;
                }
            }
        }
    }
    
</style>


<template>
    <transition name="slide">
        <div class="user-center">
            <div class="back" @click="back">
                <i class="iconfont icon-arrow-sl"></i>
            </div>
            <div class="switches-wrapper">
                <switches :currentIndex="currentIndex" :switches="switches" @switches="switchItem"></switches>
            </div>
            <div class="play-btn" @click="random">
                <i class="iconfont icon-bofang"></i>
                <span class="text">随机播放全部</span>
            </div>
            <div class="list-wrapper" ref="listWrapper">
                <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex === 0" :data="favoriteList">
                    <div class="list-inner">
                        <song-list :songs="favoriteList" @select="selectSong"></song-list>
                    </div>
                </scroll>
                <scroll ref="playList" class="list-scroll" v-if="currentIndex === 1" :data="playHistory">
                    <div class="list-inner">
                        <song-list :songs="playHistory" @select="selectSong"></song-list>
                    </div>
                </scroll>
            </div>
            <div class="no-result-wrapper" v-if="noResult">
                <no-result :title="noResultDesc"></no-result>
            </div>
        </div>
    </transition>
</template>

<script>
    import switches from '@/base/switches/switches'
    import Scroll from '@/base/scroll/scroll'
    import SongList from '@/base/song-list/song-list'
    import noResult from '@/base/no-result/no-result'
    import Song from '@/js/song'
    import { mapGetters, mapActions } from 'vuex';
    import {playlistMixin} from '@/js/mixin'

export default {
    mixins: [playlistMixin],
    data() {
        return {
            currentIndex: 0,
            switches: [
                {name: '收藏歌曲'},
                {name: '最近播放'}
            ],
        }
    },
    computed: {
        noResult() {
            if (this.currentIndex === 0) {
                return !this.favoriteList.length
            }else {
                return !this.playHistory.length
            }
        },
        noResultDesc() {
            if (this.currentIndex === 0) {
                return '暂无收藏歌曲'
            }else {
                return '最近播放歌曲为空'
            }
        },
        ...mapGetters([
            'favoriteList',
            'playHistory'
        ])
    },
    methods: {
        handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '14vw' : ''
            this.$refs.listWrapper.style.bottom = bottom
            this.$refs.favoriteList && this.$refs.favoriteList.refresh()
            this.$refs.playHistory && this.$refs.playHistory.refresh()
        },
        switchItem(index) {
            this.currentIndex = index
        },
        selectSong(song) {
            this.inserSong(new Song(song))
        },
        back() {
            this.$router.back()
        },
        random() {
            let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
            if (list.length === 0) {
                return
            }
            list = list.map((song)=>{
                return new Song(song)
            })
            this.randomPlay({
                list
            })
        },
        ...mapActions([
            'inserSong',
            'randomPlay'
        ])
    },
    components: {
        switches,
        SongList,
        Scroll,
        noResult
    }
}
</script>

<style lang="less" scoped>
    .user-center {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        background: #8c8c8c;
        &.slide-enter-active, &.slide-leave-active {
            transition: 0.3s;
        }
        &.slide-enter, &.slide-leave-to {
            transform: translate3d(100%, 0, 0);
        }
        .back {
            position: absolute;
            top: 20px;
            left: 20px;
            z-index: 50;
            .iconfont {
                font-size: 50px;
                color: #fff;
            }
        }
        .switches-wrapper {
            display: flex;
            justify-content: center;
            margin: 20px 0 100px 0;
        }
        .play-btn {
            border: 1px solid #fff;
            border-radius: 100px;
            margin: 0 auto;
            padding: 10px 0;
            box-sizing: border-box;
            width: 500px;
            text-align: center;
            color: #fff;
            .iconfont {
                font-size: 45px;
            }
        }
        .list-wrapper {
            position: absolute;
            top: 350px;
            bottom: 0;
            width: 100%;
            -background: #ccc; 
            .list-scroll {
                height: 100%;
                overflow: hidden;
                .list-inner {
                    padding: 20px 30px;
                }
            }
        }
        .no-result-wrapper {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
        }
    }
</style>


<template>
    <transition name="slide">
        <div class="add-song" v-show="showFlag" @click.stop>
            <div class="header">
                <h3 class="title">添加歌曲列表</h3>
                <div class="close" @click="hide">
                    <i class="iconfont icon-chuyidong"></i>
                </div>
            </div>
            <div class="search-box-wrapper">
                <search-box placeholder="搜索歌曲" ref="searchBox" @query="onQueryChange"></search-box>
            </div>
            <div class="shortcut" v-show="!query">
                <switches :currentIndex="currentIndex" :switches="switches" @switches="switchesItem"></switches>
                <div class="list-wrapper">
                    <scroll ref="songList" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
                        <div class="list-inner">
                            <song-list :songs="playHistory" @select="selectSong"></song-list>
                        </div>
                    </scroll>
                    <scroll ref="searchList" class="list-scroll" v-if="currentIndex === 1" :data="searchHistory">
                        <div class="list-inner">
                            <search-list @deleteOne="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
                        </div>
                    </scroll>
                </div>
            </div>
            <div class="search-result" v-show="query">
                <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
            </div>
        </div>
    </transition>    
</template>

<script>
    import SearchBox from '@/base/search-box/search-box'
    import Suggest from '@/views/suggest/suggest'
    import switches from '@/base/switches/switches'
    import Scroll from '@/base/scroll/scroll'
    import SongList from '@/base/song-list/song-list'
    import SearchList from '@/views/search-list/search-list'
    import {searchMixin} from '@/js/mixin'
    import {mapGetters, mapActions} from 'vuex'
    import Song from '@/js/song'

    export default {
        mixins: [searchMixin],
        data() {
            return {
                showFlag: false,
                
                showSinger: false,
                currentIndex: 0,
                switches: [
                    {name: '最近播放'},
                    {name: '搜索历史'}
                ]
            }
        },
        computed: {
            ...mapGetters([
                'playHistory'
            ])
        },
        methods: {
            show() {
                this.showFlag = true
                setTimeout(() => {
                    if (this.currentIndex === 0) {
                        this.$refs.songList.refresh()
                    }else {
                        this.$refs.searchList.refresh()
                    }
                }, 20)
                
            },
            hide() {
                this.showFlag = false
            },
            search(query) {
                this.query = query
            },
            selectSuggest() {
                this.saveSearch()
            },
            switchesItem(index) {
                this.currentIndex = index
            },
            selectSong(song, index) {
                if (index != 0) {
                    this.inserSong( new Song(song) )
                }
            },
            ...mapActions([
                'inserSong'
            ])
        },
        components: {
            SearchBox,
            Suggest,
            switches,
            Scroll,
            SongList,
            SearchList
        }
    }
</script>

<style lang="less" scoped>
    .add-song {
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        z-index: 30;
        background: #ccc;
        &.slide-enter-active, &.slide-leave-active {
            transition: 0.3s;
        }
        &.slide-enter, &.slide-leave-to {
            transform: translate3d(100%, 0, 0)
        }
        .header {
            position: relative;
            height: 100px;
            text-align: center;
            .title {
                line-height: 100px;
                font-size: 50px;
                color: #fff;
            }
            .close {
                position: absolute;
                top: 50%;
                right: 50px;
                transform: translateY(-50%);
                .icon-chuyidong {
                    font-size: 80px;
                }
            }
        }
       .search-box-wrapper {
           margin: 20px 40px;
       }
       .shortcut {
           display: flex;
           justify-content: center;
           .list-wrapper {
               position: absolute;
               top: 370px;
               bottom: 0;
               width: 100%;
               .list-scroll {
                   height: 100%;
                   overflow: hidden;
                   .list-inner {
                       padding: 20px 30px;
                   }
               }
           }
       } 
        .search-result {
            position: fixed;
            top: 300px;
            bottom: 0;
            width: 100%;
        }
    }
</style>

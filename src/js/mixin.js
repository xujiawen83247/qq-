import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from '@/js/config'
import { shuffle } from '@/js/util'

export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    mounted() { //组件DOM加载后触发
        this.handlePlaylist(this.playlist)
    },
    activated() { //keep-alive却换过来时触发
        this.handlePlaylist(this.playlist)
    },
    watch: {
        playlist(newVal) {
            this.handlePlaylist(newVal)
        }
    },
    methods: {
        handlePlaylist() {
            throw new Error('引入了mixin，但未定义methods中的handlePlaylist函数')
        }
    }
}

export const playerMixin = {
    computed: {
        iconMode() {
            return this.mode === playMode.sequence ? 'icon-shunxubofang' : this.mode === playMode.loop ? 'icon-ziyuan1' : 'icon-suijibofang'
        },
        ...mapGetters([
            'sequenceList',
            'currentSong',
            'playlist',
            'mode',
        ])
    },
    methods: {
        changeMode() {
            const mode = (this.mode + 1) % 3
            let list = null
            this.setPlayMode(mode)
            if (mode === playMode.random) {
                list = shuffle(this.sequenceList)
            } else {
                list = this.sequenceList
            }
            this.resetCurrentIndex(list)
            this.setPlayList(list)
            this.setPlayingState(true)
        },
        resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
                return item.id === this.currentSong.id
            })
            return index
        },
        ...mapMutations({
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex: 'SET_CURRENT_INDEX',
            setPlayMode: 'SET_PLAY_MODE',
            setPlayList: 'SET_PLAYLIST',
        })
    },
}

export const searchMixin = {
    data() {
        return {
            query: '',
            refreshDelay: 100
        }
    },
    computed: {
        ...mapGetters([
            'searchHistory',
        ])
    },
    methods: {
        onQueryChange(query) {
            this.query = query
        },
        blurInput() {
            this.$refs.searchBox.blur()
        },
        saveSearch() {
            this.saveSearchHistory(this.query)
        },
        addQuery(query) {
            this.$refs.searchBox.setQuery(query)
        },
        ...mapActions([
            'saveSearchHistory',
            'deleteSearchHistory',

        ])
    },
}
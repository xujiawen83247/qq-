import { playMode } from '@/js/config.js'
import { loadSearch } from '@/js/cache'

const state = {
    singer: {}, //歌曲数据
    playing: false,
    fullScreen: false,
    playlist: [], //顺序播放列表
    sequenceList: [], //初始播放列表，播放模式的切换将改变这个列表内歌曲的顺序
    mode: playMode.sequence, //播放模式
    currentIndex: -1, //表示当前播放的歌曲
    disc: {},
    toplist: {},
    searchHistory: loadSearch(), //搜索历史
}

export default state
<template>
    <div>
        <div class="singer" ref="singer">
            <listview :data="singer" @select="selectSinger" ref="list"></listview>
            <router-view></router-view>
        </div>
        
    </div>
</template>

<script>
import {getSinger} from '@/api/singer'
import {ERR_OK} from '@/api/config'
import Singer from '@/js/singer.js'
import listview from '@/base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from '@/js/mixin'

const HOT_NAME = '热门'
const HOT_Singer_LEN = 10
export default {
	mixins: [playlistMixin],
    data() {
        return {
            singerList: [],
            singer: []
        }
    },
    created() {
        this._getSinger()
    },
    methods: {
		handlePlaylist(playlist) {
			const bottom = playlist.length > 0 ? '14vw' : ''
			this.$refs.singer.style.bottom = bottom
			this.$refs.list.refresh()
		},
        selectSinger(singer) {
            this.$router.push({
                path: `/singer/${singer.id}`,
            })
			this.setSinger(singer)
        },
        _getSinger() {
            getSinger().then((res) => {
                if (res.code === ERR_OK) {
                     this.singerList = res.data.list
                    this.singer = this._normalizeSinger(this.singerList)
                }
                
            })
        },
        _normalizeSinger(list) {
            let map = {
                hot: {
                    title: HOT_NAME,
                    items: []
                }
            }
            list.forEach( (item, index) => {
                if (index < HOT_Singer_LEN) {
                    map.hot.items.push(new Singer({
                        id: item.Fsinger_mid,
                        name: item.Fsinger_name,
                    }))
                }
                const key = item.Findex
                if (!map[key]) {
                    map[key] = {
                        title: key,
                        items: []
                    }
                }
                map[key].items.push(new Singer({
                    id: item.Fsinger_mid,
                    name: item.Fsinger_name,
                }))
            })
            //map是一个无须列表，需要转换成有序列表
            let hot = []     //热门数据排序
            let ret = []     //剩余数据排序
            for (let key in map) {
                let val = map[key]
                if (val.title.match(/[a-zA-Z]/)) {
                    ret.push(val)
                }else if (val.title === HOT_NAME) {
                    hot.push(val)
                }
            }
            ret.sort((a, b) => {
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(ret)  //concat把hot  和 ret 的数据连接起来
        },
		...mapMutations({
			setSinger: 'SET_SINGER'
		})
    },
    components: {
        listview,
    }
}
</script>

<style lang="less" scoped>
    .singer {
        position: absolute;
        top: 220px;
        bottom: 0;
        left: 0;
        right: 0;
    }
</style>
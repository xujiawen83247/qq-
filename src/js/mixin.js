import {mapGetters} from 'vuex'

export const playlistMixin = {
	computed: {
		...mapGetters([
		'playlist'
		])
	},
	mounted() {	//组件DOM加载后触发
		this.handlePlaylist(this.playlist)
	},
	activated() {	//keep-alive却换过来时触发
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
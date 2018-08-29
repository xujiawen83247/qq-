<template>
	<transition name="slide">
		<div class="disc">
			<music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
		</div>
	</transition>
</template>

<script>
	import MusicList from '@/views/music-list/music-list'
	import {mapGetters} from 'vuex'
	import {getSongList} from '@/api/recommend.js'
	import {ERR_OK} from '@/api/config'
	import {createSong} from '@/js/song'
	
	export default {
		data() {
			return {
				songs: []
			}
		},
		created() {
			this._getSongList()
		},
		computed: {
			title() {
				return this.disc.songListDesc
			},
			bgImage() {
				return this.disc.picUrl
			},
			...mapGetters([
				'disc'
			])
		},
		methods: {
			_getSongList() {
				if (!this.disc.id) {
					this.$router.push({
						path: '/home'
					})
				}
				getSongList(this.disc.id).then((res) => {
					if (res.code === ERR_OK) {
						// console.log(res.cdlist[0].songlist)
						this.songs = this._normalizeSongs(res.cdlist[0].songlist)
						// console.log(this.songs)
					}
				})
			},
			_normalizeSongs(list) {
				let ret = []
				list.forEach((musicData) => {
					if (musicData.songid && musicData.albumid) {
						ret.push(createSong(musicData))
					}
				})
				return ret
			},
		},
		components: {
			MusicList
		}
	}
</script>

<style lang="less" scoped>
	.disc {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: #ccc;
	}
	.slide-enter,.slide-leave {
		transform: translate3d(100%,0,0);
	}
	.slide-enter-to {
		transform: translate3d(0,0,0);
	}
	.slide-enter-active{
		animation: .5s linear enter;
	}
	.slide-leave-active {
		animation: .5s linear enter reverse;
	}
	.slide-leave-to {
		transform: translate3d(100%,0,0);
	}
	@keyframes enter {
		0% {
			opacity: 0;
			transform: translateX(100%);
		}
		100% {
			opacity: 1;
			transform: translateX(0);
		}
	}
</style>
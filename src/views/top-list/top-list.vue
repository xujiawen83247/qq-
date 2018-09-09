<template>
	<transition name="slide">
		<div class="top-list">
			<music-list :title="title" :bg-image="BgImage" :songs="songs" :rank="rank"></music-list>
		</div>
	</transition>
</template>

<script>
	import MusicList from '../music-list/music-list.vue'
	import {mapGetters} from 'vuex'
	import {getMusicList} from '../../api/rank.js'
	import {ERR_OK} from '@/api/config'
	import {createSong} from '@/js/song'
	export default {
		data() {
			return {
				songs: [],
				rank: true
			}
		},
		created() {
			this._getMusicList()
		},
		computed: {
			title() {
				return this.toplist.topTitle
			},
			BgImage() {
				if (this.songs.length) {
					return this.songs[0].image
				}else {
					return this.toplist.picUrl
				}
				// return this.toplist.picUrl
			},
			...mapGetters([
				'toplist'
			])
		},
		methods: {
			_getMusicList() {
				if (!this.toplist.id) {
					this.$router.push({name: 'Rank'})
				}
				getMusicList(this.toplist.id).then((res) => {
					if (res.code === ERR_OK) {
						this.songs = this._normalizeSongs(res.songlist)
						// console.log(res)
					}
				})
			},
			_normalizeSongs(list) {
				let ret = []
				list.forEach((item) => {
					const musicData = item.data
					if (musicData.songid && musicData.albumid) {
						ret.push(createSong(musicData))
					}
				})
				return ret
			},
		},
		components: {
			MusicList,
		},
	}
</script>

<style lang="less" scoped>
	.top-list {
		position: fixed;
		bottom: 0;
		top: 0;
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
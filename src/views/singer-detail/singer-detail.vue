<template>
	<transition name="slide">
		<div class="singer-detail">
			<music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
		</div>
	</transition>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {getSingerDetail} from '@/api/singer'
	import {ERR_OK} from '@/api/config'
	import {createSong} from '@/js/song'
	import musicList from '@/views/music-list/music-list'
	export default {
		data() {
			return {
				songs: []
			}
		},
		computed: {
			title() {
				return this.singer.name
			},
			bgImage() {
				return this.singer.avatar
			},
			...mapGetters([
				'singer'
			])
		},
		created() {
			this._getDetail()
		},
		methods: {
			_getDetail(id) {
				if (!this.singer.id) {	//由于刷新当前页面会没有数据，所有需要回退到singer页面
					this.$router.push({
						path: '/singer'
					})
					return
				}
				getSingerDetail(this.singer.id).then((res) => {
					if (res.code === ERR_OK) {
						this.songs = this._normalizeSongs(res.data.list)
						// console.log(this.songs)
					}
				})
			},
			_normalizeSongs(list) {
				let ret = []
				list.forEach((item) => {
					let {musicData} = item
					if (musicData.songid && musicData.albummid) {
						ret.push(createSong(musicData))
					}
				})
				return ret
			}
		},
		components: {
			musicList
		}
	}
</script>

<style lang="less">
    .singer-detail {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 9;
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


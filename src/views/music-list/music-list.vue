<template>
	<div class="music-list">
		<div class="header">
			<div class="back" @click="back">
				<i class="fa fa-angle-left fa-lg"></i>
			</div>
			<div class="title-song">
				<h3></h3>
			</div>
		</div>
		<div class="music-list-wrapper">
			<div class="bg-img" :style="bgStyle" ref="bgImage">
				<!--<img src="//y.gtimg.cn/music/photo_new/T001R300x300M0000025NhlN2yWrP4.jpg?max_age=2592000" />-->
				<div class="text">
					<h3 class="list-title">{{title}}</h3>
				</div>
				<div class="sequence-play" v-show="items.length>0" ref="playBtn" @click="random">	
					<div class="inner">
						<i class="fa fa-play-circle-o fa-lg"></i>
						<span>随机播放<span class="songNum">(共 {{songs.length}} 首)</span></span>
					</div>
				</div>
			</div>
			
			<div class="song-list-wrapper">
				
				<div class="bg-layer" ref="bgLayer"></div>
				<scroll :data="items" :probe-type="probeType" :listen-scroll="listenScroll" class="song-list" ref="songList" @scroll="scroll">

					<div class="scroll-wrapper">
						<song-list :rank="rank" :songs="songs" @select="selectItem"></song-list>
					</div>
				</scroll>
			</div>
		</div>
	</div>
</template>

<script>
	import Scroll from '@/base/scroll/scroll'
	import songList from '@/base/song-list/song-list'
	import {mapActions} from 'vuex'
	import {playlistMixin} from '@/js/mixin'
	
	const RESERVED_HEIGHT = 40
	export default {
		mixins: [playlistMixin],
		data() {
			return {
				items: [],
				scrollY: 0,
			}
		},
		props: {
			bgImage: {
				type: String,
				default: ''
			},
			songs: {
				type: Array,
				default: []
			},
			title: {
				type: String,
				default: ''
			},
			rank: {
				type: Boolean,
				default: false,
			}
		},
		created() {
			this.probeType = 3
			this.listenScroll = true
		},
		watch: {
			songs() {
				this.items = this.songs
			},
			scrollY(newY) {
				let translateY = Math.max(this.minTranslateY,newY)
				let zIndex = 0
				let scale = 1
				this.$refs.bgLayer.style['transform'] = `translate3d(0,${translateY}px,0)`
				this.$refs.bgLayer.style['webkitTransform'] = `translate3d(0,${translateY}px,0)`
				const percent = Math.abs(newY/this.imageHeight)
				if (newY > 0) {
					scale = 1 + percent
					zIndex = 10
				}
				if (newY < this.minTranslateY) {
					zIndex = 10
					this.$refs.bgImage.style.paddingTop = 0
					this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
					this.$refs.playBtn.style.display = 'none'
				}else {
					this.$refs.bgImage.style.paddingTop = '75%'
					this.$refs.bgImage.style.height = 0
					this.$refs.playBtn.style.display = 'block'
				}
				this.$refs.bgImage.style.zIndex = zIndex
				this.$refs.bgImage.style['transform'] = `scale(${scale})`
				this.$refs.bgImage.style['webkitTransform'] = `scale(${scale})`
			}
		},
		mounted() {
			this.imageHeight = this.$refs.bgImage.clientHeight
			this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
			this.$refs.songList.$el.style.top = `${this.$refs.bgImage.clientHeight}px`
		},
		methods: {
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '14vw' : ''
				this.$refs.songList.$el.style.bottom = bottom
				this.$refs.songList.refresh()
			},
			scroll(pos) {
				this.scrollY = pos.y
			},
			back() {
				this.$router.back()
			},
			selectItem(song, index) {
				this.selectPlay({
					list: this.items,
					index
				})
			},
			random() {
				this.randomPlay({
					list: this.items
				})
			},
			...mapActions([
				'selectPlay',
				'randomPlay'
			])
		},
		computed: {
			bgStyle() {
				return `background-image: url(${this.bgImage})`
			}
		},
		components: {
			songList,
			Scroll
		}
	}
</script>

<style lang="less" scoped>
	.music-list {
		.header {
			position: fixed;
			top: 0;
			left: 0;
			padding-left: 25px;
			width: 100%;
			height: 84px;
			line-height: 84px;
			background: transparent;
			color: #fff;
			z-index: 9;
			.back {
				float: left;
				margin-right: 20px;
			}
			.title-song {
				float: left;
				h3 {
					font-weight: 400;
					font-size: 12px;
				}
			}
		}
	}
	
	.music-list-wrapper {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		.bg-img {
			position: relative;
			padding-top: 75%;
			width: 100%;
			height: 0;
			transform-origin: top;
			background: url('//y.gtimg.cn/music/photo_new/T001R300x300M0000025NhlN2yWrP4.jpg?max_age=2592000') no-repeat;
			background-size: cover;
			-background-position: 0 30%;
			.text {
				position: absolute;
				left: 20px;
				bottom: 40px;
				color: #fff;
				font-weight: 400;
			}
		}
	}
	.song-list-wrapper {
		position: relative;
		border-radius: 10px;
		position: relative;
		top: 0px;
		bottom: 0;
		background: #fff;
		
	}
	.song-list {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		-overflow: hidden;
		z-index: 3;
	}
	.scroll-wrapper {
		
	}
	.bg-layer {
		position: fixed;
		width: 100%;
		height: 100%;
		background: #ccc;
		z-index: 2;
	}
	.sequence-play {
		position: relative;
		left: 50%;
		float: left;
		.inner {
			position: relative;
			bottom: 250px;
			left: -50%;
			border: 2px solid coral;
			border-radius: 50px;
			padding: 30px;
			background: transparent;
			color: coral;
		}
	}
</style>
<template>
	<div class="player" v-show="playlist.length>0">
		<transition name="normal"
			@enter="enter"
			@after-enter="afterEnter"
			@leave="leave"
			@after-leave="afterLeave"
		>
			<div class="normal-player" v-show="fullScreen">
				<div class="bg">
					<div class="filter"></div>
					<img :src="currentSong.image" width="100%" height="100%"/>
				</div>
				
				<div class="top">
					<div class="back" @click="back">
						<i class="fa fa-angle-down"></i>
					</div>
					<h3 class="title" v-html="currentSong.name"></h3>
					<h4 class="subtitle" v-html="currentSong.singer"></h4>
				</div>
				
				<div class="middle" @touchstart.prevent="middleTouchStart" @touchmove.prevent="middleTouchMove" @touchend.prevent="middleTouchEnd">
					<transition name="middleL">
						<div class="middle-l" ref="middleL">
							<div class="cd-wrapper" ref="cdWrapper">
								<div class="cd" :class="cdCls">
									<img class="image" :src="currentSong.image"/>
								</div>
							</div>
							<div class="playing-lyric-wrapper">
								<div class="playing-lyric">{{playLyric}}</div>
							</div>
						</div>
					</transition>
					<transition name="middleR">
						<scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
							<div class="lyric-wrapper">
								<div class="currentLyric" v-if="currentLyric">
									<p class="text" :class="{'current': currentLineNum === index}" ref="lyricline" v-for="(line, index) in currentLyric.lines" :key="index">{{line.txt}}</p>
								</div>
								<p class="no-lyric" v-if="currentLyric === null">没有歌词</p>		
							</div>
						</scroll>
					</transition>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active': currentShow === 'cd'}"></span>
						<span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
					</div>
					<div class="progress-wrapper">
						<span class="time time-l">{{format(currentTime)}}</span>
						<div class="progress-bar-wrapper">
							<progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
						</div>
						<span class="time time-r">{{format(currentSong.duration)}}</span>
					</div>
					<div class="operators">
						<div class="icon i-left" @click="changeMode">
							<i class="fa" :class="iconMode"></i>
						</div>
						<div class="icon i-left">
							<i class="fa fa-step-backward" @click="prev"></i>
						</div>
						<div class="icon i-center">
							<i class="fa" :class="playingIcon" @click="togglePlaying"></i>
						</div>
						<div class="icon i-right">
							<i class="fa fa-step-forward" @click="next"></i> 
						</div>
						<div class="icon i-right">
							<i class="fa fa-heart-o"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="miniPlayer">
			<div class="mini-player" v-show="!fullScreen" @click="open">
				<div class="icon">
					<img :src="currentSong.image" width="40" height="40" :class="cdCls"/>
				</div>
				<div class="text">
					<h3 class="name" v-html="currentSong.name"></h3>
					<h4 class="desc" v-html="currentSong.singer"></h4>
				</div>
				<div class="control" @click.stop="togglePlaying">
					<progress-circle :radiusW="radiusW" :radiusH="radiusH" :percent="percent">
						<i class="fa miniPlayIcon ignore" :class="miniPlayingIcon" ref="miniPlay"></i>
					</progress-circle>
				</div>
				<div class="control" @click.stop="showPlayList">
					<i class="fa fa-list"></i>
				</div>
				<audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updataTime" @ended="end"></audio>
			</div>
		</transition>
		<play-list ref="playlist"></play-list>
	</div>
</template>

<script>
	import {mapGetters, mapMutations} from 'vuex'
	import {playMode} from '@/js/config'
	import {shuffle} from '@/js/util'
	import animations from 'create-keyframe-animation'
	import Lyric from 'lyric-parser'
	import Scroll from '@/base/scroll/scroll'
	import progressBar from '@/base/progress-bar/progress-bar'
	import progressCircle from '@/base/progress-circle/progress-circle'
	import PlayList from '@/views/playlist/playlist'

	export default {
		data() {
			return {
				songReady: false,
				currentTime: 0,
				radiusW: 24,
				radiusH: 28,
				currentLyric: null,
				currentLineNum: 0,
				currentShow: 'cd',
				playLyric: '',
			}
		},
		computed: {
			cdCls() {
				return this.playing ? 'play' : 'play pause'
			},
			playingIcon() {
				return this.playing ? 'fa-pause-circle-o' : 'fa-play-circle-o'
			},
			miniPlayingIcon() {
				return this.playing ? 'fa-pause-circle-o' : 'fa-play-circle-o'
			},
			percent() {
				return this.currentTime / this.currentSong.duration
			},
			iconMode() {
				return this.mode === playMode.sequence ? 'fa-list-ol' : this.mode === playMode.loop ? 'fa-exchange' : 'fa-random'
			},
			...mapGetters([
				'fullScreen',
				'playlist',
				'currentSong',
				'playing',
				'currentIndex',
				'mode',
				'sequenceList',
			])
		},
		created() {
			this.touch = {}
		},
		methods: {
			back() {	//返回上一层
				this.setFullScreen(false)
			},
			open() {	//显示歌手页面
				this.setFullScreen(true)
			},
			enter(el, done) {	//进入动画的钩子
				const {x, y, scale} = this._getPosAndScale()
				let animation = {	//定义动画
					0: {
						transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
					},
					60: {
						transform: `translate3d(0, 0, 0) scale(1.1)`
					},
					100: {
						transform: `translate3d(0, 0, 0) scale(1)`
					},
				}
				animations.registerAnimation({	//注册animations
					name: 'move',		
					animation,	//插入自定义动画就是上面的  定义动画
					presets: {	//配置
						duration: 400,	//持续时间
						easing: 'linear',	//过度效果
					}
				})
				animations.runAnimation(this.$refs.cdWrapper, 'move', done)	//运行动画，done参数表示动画结束后  跳入 afterEnter
			},
			afterEnter() {	//动画结束钩子
				animations.unregisterAnimation('move')	//结束动画
				this.$refs.cdWrapper.style.animation = ''	//清空style
			},
			leave(el, done) {	//离开页面时动画
				this.$refs.cdWrapper.style.transition = 'all 0.4s'
				const {x, y, scale} = this._getPosAndScale()
				this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
				this.$refs.cdWrapper.addEventListener('transitionend', done)	//动画结束是调用 done
			},
			afterLeave() {	//动画结束时 清空style
				this.$refs.cdWrapper.style.transition = ''
				this.$refs.cdWrapper.style.transform = ''
			},
			togglePlaying() {	//歌曲播放与暂停
// 				if (!this.songReady) {
// 					return
// 				}
				const	audio = this.$refs.audio
				this.setPlayingState(!this.playing)
				this.playing ? audio.play() : audio.pause()
				if (this.currentLyric) {
					this.currentLyric.togglePlay()
				}
				// this.songReady = false
			},
			end() {	//歌曲播放完毕
				if (this.mode === playMode.loop) {
					this.loop()
				}else {
					this.next()
				}
			},
			loop() {	//循环播放
				this.$refs.audio.currentTime = 0
				this.$refs.audio.play()
				if (this.currentLyric) {
					this.currentLyric.seek(0)
				}
			},
			prev() {	//上一曲
				if (!this.songReady) {	//歌曲url还没加载时  禁止播放
					return
				}
				if (this.playlist.length === 1) {
					this.loop()
				}else {
					let index = this.currentIndex - 1
					if (index === -1) {
						index = this.playlist.length - 1
					}
					this.setCurrentIndex(index)
					if (!this.playing) {
						this.togglePlaying()
					}
				}
				this.songReady = false
			},
			next() {	//下一曲
				if (!this.songReady) {
					return
				}
				if (this.playlist.length === 1) {
					this.loop()
				}else {
					let index = this.currentIndex + 1
					if (index === this.playlist.length) {
						index = 0
					}
					this.setCurrentIndex(index)
					if (!this.playing) {
						this.togglePlaying()
					}
				}
				this.songReady = false
			},
			ready() {	//歌曲url加载完成
				this.songReady = true
			},
			error() {
				this.songReady = true
			},
			updataTime(e) {	//获取歌曲当前播放的时间
				this.currentTime = e.target.currentTime
			},
			format(interval) {	//歌曲当前时间的转化
				interval = Math.floor(interval)
				const minute = Math.floor(interval / 60)
				const second = this._pod(interval % 60)
				return `${minute}:${second}`
			},
			onProgressBarChange(percent) {
				const currentTime = this.currentSong.duration * percent
				this.$refs.audio.currentTime = currentTime
				if (!this.playing) {
					this.togglePlaying()
				}
				if (this.currentLyric) {
					this.currentLyric.seek(currentTime * 1000)
				}
			},
			changeMode() {
				const mode = (this.mode + 1) % 3
				let list = null
				this.setPlayMode(mode)
				if (mode === playMode.random) {
					list = shuffle(this.sequenceList)
				}else {
					list = this.sequenceList
				}
				this.resetCurrentIndex(list)
				this.setPlayList(list)
			},
			resetCurrentIndex(list) {
				let index = list.findIndex((item) => {
					return item.id === this.currentSong.id
				})
				return index
			},
			getLyric() {
				this.currentSong.getLyric().then((lyric) => {
					this.currentLyric = new Lyric(lyric, this.handleLyric)
					if (this.playing) {
						this.currentLyric.play()
					}
				}).catch(() => {
					this.currentLyric = null
					this.playingLyric = ''
					this.currentLineNum = 0
				})
			},
			handleLyric({lineNum, txt}) {
				this.currentLineNum = lineNum
				if (lineNum > 5) {
					let lineEl = this.$refs.lyricline[lineNum-5]
					this.$refs.lyricList.scrollToElement(lineEl, 1000)
				}else {
					this.$refs.lyricList.scrollTo(0, 0, 1000)
				}
				this.playLyric = txt
			},
			middleTouchStart(e) {
				this.touch.initiated = true
				const touch = e.touches[0]
				this.touch.startX = touch.pageX
				this.touch.startY = touch.pageY
			},
			middleTouchMove(e) {
				if (!this.touch.initiated) {
					return
				}
				const touch = e.touches[0]
				const deltaX = touch.pageX - this.touch.startX
				const deltaY = touch.pageY - this.touch.startY
				if (Math.abs(deltaY) > Math.abs(deltaX)) {
					return
				}
				const left = this.currentShow === 'cd' ? 0 : -window.innerWidth 
				const offsetWidth = Math.min(0, Math.max(-window.innerWidth, deltaX+left))
				this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
				this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
				this.$refs.lyricList.$el.style.transition = 0 + 'ms'
				this.$refs.middleL.style.opacity = 1 - this.touch.percent
				this.$refs.middleL.style.transition = 0 + 'ms'
			},
			middleTouchEnd() {
				let offsetWidth
				let opacity
				if (this.currentShow === 'cd') {
					if (this.touch.percent > 0.1) {
						offsetWidth = -window.innerWidth
						this.currentShow = 'lyric'
						opacity = 0
					}else {
						offsetWidth = 0
						opacity = 1
					}
				}else {
					if (this.touch.percent < 0.9) {
						offsetWidth = 0
						this.currentShow = 'cd'
						opacity = 1
					}else {
						offsetWidth = -window.innerWidth
						opacity = 0
					}
				}
				this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
				this.$refs.lyricList.$el.style.transition = 300 + 'ms'
				this.$refs.middleL.style.opacity = opacity
				this.$refs.middleL.style.transition = 300 + 'ms'
			},
			showPlayList() {	//mini播放器歌曲列表
				this.$refs.playlist.show()
			},
			_pod(num, n = 2) {	//个位数时补0
				let len = num.toString().length
				while (len < n) {
					num = '0' + num
					len++
				}
				return num
			},
			_getPosAndScale() {
				const targetWidth = 40
				const paddingLeft = 20
				const paddingBottom = 30
				const paddingTop = 80
				const width = window.innerWidth * 0.8
				const scale = targetWidth / width
				const x = -(window.innerWidth / 2 - paddingLeft)
				const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
				return {x, y, scale}
			},
			...mapMutations({
				setFullScreen: 'SET_FULL_SCREEN',
				setPlayingState: 'SET_PLAYING_STATE',
				setCurrentIndex: 'SET_CURRENT_INDEX',
				setPlayMode: 'SET_PLAY_MODE',
				setPlayList: 'SET_PLAYLIST',
			})
		},
		watch: {
			currentSong(newSong, odlSong) {
				if (!newSong.id) {
					return
				}
				if (newSong.id === odlSong.id) {
					return
				}
				if (this.currentLyric) {
					this.currentLyric.stop()
				}
				setTimeout(() => {
					this.$refs.audio.play()
					this.getLyric()
				}, 1000)
			},
			playing(newPlaying) {
				const audio = this.$refs.audio
				this.$nextTick(() => {
					newPlaying ? audio.play() : audio.pause()
				})
			},
			
		},
		components: {
			progressBar,
			progressCircle,
			Scroll,
			PlayList,
		}
	}
</script>

<style lang="less" scoped>
	.player {
		color: #fff;
		.normal-player {
			position: fixed;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: #CCCCCC;
			z-index: 20;
			.bg {
				position: absolute;
				left: -50%;
				top: -50%;
				width: 300%;
				height: 300%;
				z-index: -1;
				opacity: 0.6;
				filter: blur(30px);
				.filter {
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					background: black;
					opacity: 0.6;
				}
			}
			.top {
				position: relative;
				margin-bottom: 25px;
				.back {
					position: absolute;
					top: 0;
					left: 6px;
					width: 100px;
					height: 100px;
					z-index: 20;
					text-align: center;
					.fa-angle-down {
						display: block;
						padding: 5px 9px;
						font-size: 100px;
						
						color: #fff;
					}
				}
				.title {
					margin: 0 auto;
					padding-top: 10px;
					width: 70%;
					text-align: center;
					font-weight: bold;
				}
				.subtitle {
					margin: 0 auto;
					width: 70%;
					font-weight: normal;
					text-align: center;
				}
			}
			.middle {
				-display: flex;
				-align-items: center;
				position: fixed;
				top: 80px;
				bottom: 200px;
				width: 100%;
				white-space: nowrap;
				font-size: 0;
				.middle-l {
					display: inline-block;
					vertical-align: top;
					position: relative;
					top: 50%;
					transform: translateY(-50%);
					width: 100%;
					height: 0;
					padding-top: 80%;
					&.middleL-enter-active, &.middleL-leave-active {
					  transition: all 0.3s
					}
					&.middleL-enter, &.middleL-leave-to {
					  opacity: 0
					}
					.cd-wrapper {
						position: absolute;
						left: 10%;
						top: 0;
						width: 80%;
						height: 100%;
						.cd {
							width: 100%;
							height: 100%;
							box-sizing: border-box;
							border: 15px solid rgba(255, 255, 255, 0.1);
							border-radius: 50%;
							&.play {
							  animation: rotate 20s linear infinite;
							}
							&.pause {
							  animation-play-state: paused;
							}
							.image {
								position: absolute;
								left: 0;
								top: 0;
								border-radius: 50%;
								width: 100%;
								height: 100%;
							}
						}
					}
					.playing-lyric-wrapper {
						position: absolute;
						left: 0;
						bottom: -250px;
						z-index: 10;
						width: 100vw;
						height: 100px;
						text-align: center;
						opacity: 0.8;
						.playing-lyric {
							height: 100%;
							color: #fff;
							font-size: 50px;
							line-height: 100px;
						}
					}
				}
				.middle-r {
					display: inline-block;
					position: absolute;
					top: 60px;
					width: 100%;
					height: 90%;
					-vertical-align: top;
					overflow: hidden;
					-transform: translate3d(100%,0,0);
					&.middleR-enter-active, &.middleR-leave-active {
						transition: .2s;
					}
					&.middleR-enter, &.middleR-leave-to {
						opacity: 0;
					}
					.lyric-wrapper {
						margin: 0 auto;
						margin-top: 20px;
						width: 80%;
						overflow: hidden;
						text-align: center;
						.text {
							line-height: 100px;
							color: #FFFFFF;
							font-size: 50px;
							&.current {
								color: #30C37C;
							}
						}
						.no-lyric {
							margin-top: 60%;
							line-height: 40px;
							color: #fff;
							font-size: 20px;
						}
					}
				}
			}
			.bottom {
				position: absolute;
				bottom: 100px;
				width: 100%;
				.progress-wrapper {
					display: flex;
					align-items: center;
					margin: 0 auto;
					padding: 10px 0;
					width: 80%;
					.time {
						flex: 0 0 30px;
						
						line-height: 30px;
						font-size: 16px;
						&.time-l {
							padding-right: 10px;
							text-align: left;
						}
						&.time-r {
							padding-left: 10px;
							text-align: right;
						}
					}
					.progress-bar-wrapper {
						flex: 1;
					}
				}
				.operators {
					display: flex;
					align-items: center;
					.icon {
						flex: 1;
						color: #fff;
					}
					.i-left {
						text-align: right;
					}
					.i-center {
						padding: 0 20px;
						text-align: center;
					}
					.i-right {
						text-align: left;
					}
				}
			}
			&.normal-enter-active, &.normal-leave-active {
			  transition: all 0.4s;
			  .top, .bottom {
				transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
			  }
			}
			&.normal-enter, &.normal-leave-to {
			  opacity: 0;
			}
		}
		.mini-player {
			display: flex;
			align-items: center;
			position: fixed;
			left: 0;
			bottom: 0;
			z-index: 30;
			width: 100%;
			height: 150px;
			background: rgba(255, 255, 255, 0.85);
			&.miniPlayer-enter-active, &.miniPlayer-leave-active {
      transition: all 0.4s
			}
			&.miniPlayer-enter, &.miniPlayer-leave-to {
				opacity: 0
			}
			.icon {
				flex: 0 0 40px;
				margin-right: 40px;
				padding: 0 10px 0 20px;
				
				img {
					border-radius: 50%;
					&.play {
						animation: rotate 10s linear infinite;
					}
					&.pause {
						animation-play-state: paused;
					}
				}
			}
			.text {
				display: flex;
				flex-direction: column;
				flex: 1;
				overflow: hidden;
				.name {
					margin-bottom: 2px;
					font-size: 16px;
					color: #9B9B9B;
				}
				.desc {
					font-size: 14px;
					color: #9B9B9B;
				}
			}
			.control {
				flex: 0 0 30px;
				padding: 0 20px;
				text-align: center;
				i {
					font-size: 60px;
					color: #9B9B9B;
				}
				.miniPlayIcon {
					position: absolute;
					top: 0;
					left: 0;
					z-index: -1;
					
				}
				.ignore {
					font-size: 28px;
				}
			}
		}
	}
	.dot-wrapper {
		position: absolute;
		left: 0;
		bottom: 100px;
		width: 100vw;
		height: 100px;
		z-index: 20;
		text-align: center;
		line-height: 100px;
		.dot {
			display: inline-block;
			border-radius: 30px;
			margin-right: 10px;
			width: 30px;
			height: 30px;
			background: #fff;
			&.active {
				width: 50px;
				background: #30C37C;
			}
		}
	}
	@keyframes rotate {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
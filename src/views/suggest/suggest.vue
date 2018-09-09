<template>
	<scroll class="suggest" 
		:data="result" 
		:pullup="pullup" 
		@scrollToEnd="searchMore" 
		:beforeScroll="beforeScroll" 
		@beforeScroll="listScroll"
		ref="suggest"
	>
		<ul class="suggest-list">
			<li class="suggest-item" v-for="(item,index) in result" :key="index" @click="selectItem(item)">
				<div class="icon">
					<i class="iconfont" :class="getIconCls(item)"></i>
				</div>
				<div class="info">
					<p class="singer" v-html="getDisplayName(item)">歌曲</p>
				</div>
			</li>
			<loading v-show="hasMore" title=""></loading>
		</ul>
		<div class="no-result-wrapper" v-show="!hasMore && !result.length">
			<no-result title="抱歉,没有搜索结果"></no-result>
		</div>
	</scroll>
</template>

<script>
	import {search} from '@/api/search'
	import {ERR_OK} from '@/api/config'
	import {createSong} from '@/js/song'
	import Scroll from '@/base/scroll/scroll'
	import loading from '@/components/loading'
	import Singer from '@/js/singer'
	import NoResult from '@/base/no-result/no-result'
	import {mapMutations, mapActions} from 'vuex'
	
	const TYPE_SINGER = 'singer'
	const perpage = 20
	
	export default {
		props: {
			query: {
				type: String,
				default: ''
			},
			showSinger: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				page: 1,
				result: [],
				pullup: true,
				hasMore: true,
				beforeScroll: true,
			}
		},
		methods: {
			search() {
				this.page = 1
				this.$refs.suggest.scrollTo(0, 0)
				this.hasMore = true
				search(this.query, this.page, this.showSinger, perpage).then((res) => {
					if (res.code === ERR_OK) {
						this.result = this._genResult(res.data)
						// console.log(this.result)
						this._checkMore(res.data)
					}
				})
			},
			getIconCls(item) {
				if (item.type === TYPE_SINGER) {
					return 'icon-yonghu'
				}else {
					return 'icon-yinyue'
				}
			},
			getDisplayName(item) {
				if (item.type === TYPE_SINGER) {
					return item.singername
				}else {
					return `${item.name}-${item.singer}`
				}
			},
			selectItem(item) {
				if (item.type === TYPE_SINGER) {
					const singer = new Singer({
						id: item.singermid,
						name: item.singername
					})
					this.$router.push({
						path: `/search/${singer.id}`
					})
					this.setSinger(singer)
				}else {
					this.inserSong(item)
				}
				this.$emit('select')
			},
			searchMore() {
				if (!this.hasMore) {
					return
				}
				this.page++
				search(this.query, this.page, this.showSinger, perpage).then((res) => {
					if (res.code === ERR_OK) {
						this.result = this.result.concat(this._genResult(res.data))
						this._checkMore(res.data)
					}
				})
			},
			listScroll() {
				this.$emit('listScroll')
			},
			refresh() {
				this.$refs.suggest.refresh()
			},
			_checkMore(data) {
				const song = data.song
				if (!song.list.length || (song.curnum + song.curpage * perpage) >= song.totalnum) {
					this.hasMore = false
				}
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
			_genResult(data) {
				let ret = []
				if (data.zhida && data.zhida.singerid) {
					ret.push({...data.zhida,...{type: TYPE_SINGER}})
				}
				if (data.song) {
					ret = ret.concat(this._normalizeSongs(data.song.list))
				}
				return ret
			},
			...mapMutations({
				setSinger: 'SET_SINGER'
			}),
			...mapActions([
				'inserSong'
			])
		},
		watch: {
			query() {
				this.search()
			}
		},
		components: {
			Scroll,
			loading,
			NoResult,
		}
	}
</script>

<style lang="less" scoped>
	.suggest {
		margin-top: 0px;
		height: 100%;
		overflow: hidden;
		.suggest-list {
			.suggest-item {
				display: flex;
				align-items: center;
				border-bottom: 1px solid #ccc;
				padding-top: 10px;
				padding-bottom: 20px;
				background: #fff;
				.icon {
					flex: 0 0 30px;
					width: 100px;
					color: #a6a6a6;
					margin-right: 10px;
					.iconfont {
						font-size: 70px;
					}
				}
				.info {
					flex: 1;
					overflow: hidden;
					.singer {
						font-size: 40px;
						color: #000;
					}
					.name {
						font-size: 16px;
						color: #808080;
					}
				}
			}
		}
		.no-result-wrapper {
			position: absolute;
			top: 50%;
			width: 100%;
			transform: translateY(-50%);
			
		}
	}
</style>
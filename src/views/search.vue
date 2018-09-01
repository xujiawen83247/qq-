<template>
    <div class="search">
		<div class="search-box-wrapper">
			<search-box ref="searchBox" @query="onQueryChange"></search-box>
		</div>
		<div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
			<scroll class="shortcut" :data="shortcut" ref="shortcut">
				<div>
					<div class="hot-key">
						<h3>热门搜索</h3>
						<ul class="hot-key-list">
							<li class="hot-key-item" v-for="(hotkey,index) in hotKey" :key="index" @click="addQuery(hotkey.k)">{{hotkey.k}}</li>
						</ul>
					</div>
					<div class="search-history" v-show="searchHistory.length">
						<h3 class="search-history-title">
							<span>搜索历史</span>
							<i class="iconfont icon-shanchu" @click="clearAll"></i>
						</h3>
						<search-list :searches="searchHistory" @select="addQuery" @deleteOne="deleteOne"></search-list>
					</div>
				</div>
			</scroll>
		</div>
		<div class="search-result" v-show="query" ref="searchRes">
			<suggest @select="saveSearch" :query="query" @listScroll="blurInput" ref="suggest"></suggest>
		</div>
		<confirm ref="confirm" text="是否清空所有搜索历史记录" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
		<router-view></router-view>
    </div>
</template>

<script>
	import SearchBox from '@/base/search-box/search-box'
	import Suggest from '@/views/suggest/suggest'
	import {getHotKey} from '@/api/search'
	import {ERR_OK} from '@/api/config'
	import {mapActions, mapGetters} from 'vuex'
	import SearchList from '@/views/search-list/search-list'
	import confirm from '@/base/confirm/confirm'
	import Scroll from '@/base/scroll/scroll'
	import {playlistMixin} from '@/js/mixin'

	export default {
		mixins: [playlistMixin],
		data() {
			return {
				hotKey: [],
				query: '',
			}
		},
		created() {
			this._getHotKey()
		},
		computed: {
			shortcut() {
				return this.hotKey.concat(this.searchHistory)
			},
			...mapGetters([
				'searchHistory',
			])
		},
		methods: {
			handlePlaylist(playlist) {
				const bottom = playlist.length ? '14vw' : ''
				this.$refs.shortcutWrapper.style.bottom = bottom
				this.$refs.shortcut.refresh()
				this.$refs.searchRes.style.bottom = bottom
				this.$refs.suggest.refresh()
			},
			addQuery(query) {
				this.$refs.searchBox.setQuery(query) 
			},
			deleteOne(item) {
				this.deleteSearchHistory(item)
			},
			clearAll() {
				// this.clearSearchHistory()
				this.$refs.confirm.show()
			},
			_getHotKey() {
				getHotKey().then((res) => {
					if (res.code === ERR_OK) {
						//console.log(res.data.hotkey)
						this.hotKey = res.data.hotkey.slice(0, 10)
					}
				})
			},
			onQueryChange(query) {
				this.query = query
			},
			blurInput () {
				this.$refs.searchBox.blur()
			},
			saveSearch() {
				this.saveSearchHistory(this.query)
			},
			...mapActions([
				'saveSearchHistory',
				'deleteSearchHistory',
				'clearSearchHistory',
			])
		},
		watch: {
			query(newQuery) {
				if (!newQuery) {
					setTimeout(() =>{
						this.$refs.shortcut.refresh()
					}, 20)
				}
			}
		},
		components: {
			SearchBox,
			Suggest,
			SearchList,
			confirm,
			Scroll,
		},
	}
</script>

<style lang="less" scoped>
	.search {
		position: fixed;
		top: 20.371vw;
		bottom: 0;
		width: 100%;
		
		background: #f4f4f4;
		z-index: 1;
		.search-box-wrapper {
			position: relative;
			padding: 20px 40px;
			z-index: 11;
			background: #f4f4f4;
		}
		.shortcut-wrapper {
			position: fixed;
			top: 37vw;
			bottom: 0;
			padding: 0 40px;
			-height: 100%;
			overflow: hidden;
			background: #f4f4f4;
			.shortcut {
				height: 100%;
			}
			h3 {
				height: 110px;
				line-height: 110px;
				font-size: 36px;
				color: #808080;
				font-weight: 400;
			}
			.hot-key-list {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				.hot-key-item {
					border: 1px solid #969696;
					border-radius: 40px;
					margin-top: 10px;
					margin-right: 25px;
					padding: 0 25px;
					height: 80px;
					line-height: 80px;
					font-size: 32px;
					&:nth-of-type(1) {
						border: 1px solid #31c37c;
						color: #31c37c;
					}
				}
			}
			.search-history {
				margin-top: 50px;
				.search-history-title {
					display: flex;
					flex-direction: row;
					span {
						flex: 1;
					}
					.icon-shanchu {
						font-size: 40px;
					}
				}
			}
		}
		.search-result {
			position: relative;
			height: 80vh;
			padding: 0 40px;
			background: #fff;
		}
	}
</style>

<template>
    <div class="search">
		<div class="search-box-wrapper">
			<search-box ref="searchBox" @query="onQueryChange"></search-box>
		</div>
		<div class="shortcut-wrapper" v-show="!query">
			<div class="shortcut">
				<div class="hot-key">
					<h3>热门搜索</h3>
					<ul>
						<li v-for="(hotkey,index) in hotKey" :key="index" @click="addQuery(hotkey.k)">{{hotkey.k}}</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="search-result" v-show="query">
			<suggest @select="saveSearch" :query="query" @listScroll="blurInput"></suggest>
		</div>
		<router-view></router-view>
    </div>
</template>

<script>
	import SearchBox from '@/base/search-box/search-box'
	import Suggest from '@/views/suggest/suggest'
	import {getHotKey} from '@/api/search'
	import {ERR_OK} from '@/api/config'
	import {mapActions} from 'vuex'
	export default {
		data() {
			return {
				hotKey: [],
				query: '',
			}
		},
		created() {
			this._getHotKey()
		},
		methods: {
			addQuery(query) {
				this.$refs.searchBox.setQuery(query) 
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
			])
		},
		components: {
			SearchBox,
			Suggest,
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
		.search-box-wrapper {
			padding: 20px 40px;
		}
		.shortcut-wrapper {
			padding: 0 40px;
			h3 {
				height: 110px;
				line-height: 110px;
				font-size: 36px;
				color: #808080;
				font-weight: 400;
			}
			ul {
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				li {
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
		}
		.search-result {
			height: 80vh;
			padding: 0 40px;
			
			background: #fff;
		}
	}
</style>

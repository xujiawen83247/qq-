<template>
	<div class="search-box">
		<i class="iconfont icon-sousuo isousuo"></i>
		<input class="box" v-model="query" :placeholder="placeholder" ref="query"/>
		<i class="iconfont icon-chuyidong ishanchu" v-show="query" @click="clear"></i>
	</div>
</template>

<script>
	import {debounce} from '@/js/util'
	export default {
		props: {
			placeholder: {
				type: String,
				default: '搜索歌曲、歌单、专辑'
			},
		},
		data() {
			return {
				query: ''
			}
		},
		created() {
			this.$watch('query', debounce( (newQuery) => {
				this.$emit('query', newQuery)
			}, 200) )
		},
		methods: {
			clear() {
				this.query = ''
			},
			setQuery(query) {
				this.query = query
			},
			blur() {
				this.$refs.query.blur()
			},
		},
	}
</script>

<style lang="less" scoped>
	.search-box {
		display: flex;
		align-items: center;
		box-sizing: border-box;
		border-radius: 16px;
		padding: 0 30px;
		width: 100%;
		height: 130px;
		background: #fff;
		.isousuo {
			font-size: 60px;
			color: #c8c8c8;
		}
		.box {
			border: none;
			flex: 1;
			margin: 0 10px;
			padding: 0 10px;
			background: #fff;
			color: #c8c8c8;
			font-size: 40px;
		}
		.ishanchu {
			font-size: 60px;
			color: #c8c8c8;
		}
	}
</style>
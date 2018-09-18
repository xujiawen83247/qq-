<template>
	<div class="songs-list">
		<ul>
			<li v-for="(song, index) in songs" class="item" :key="index" @click="selectItem(song, index)">
				<div class="num" :class="getRankCls(index)" v-show="rank">{{getRankText(index)}}</div>
				<div class="desc">
					<h3>{{song.name}}</h3>
					<p>{{song.singer}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				items: []
			}
		},
		props: {
			songs: {
				type: Array,
				default: []
			},
			rank: {
				type: Boolean,
				default: false,
			}
		},
		// watch: {
		// 	songs() {	
		// 		this.items = this.songs
		// 		// console.log(this.items)
		// 	}
		// },
		methods: {
			selectItem(song, index) {
				this.$emit('select', song, index)
			},
			getRankCls(index) {
				if (index === 0) {
					return 'iconfont icon-jiangbei1 rank-gold'
				}else if (index === 1) {
					return 'iconfont icon-jiangbei1 rank-silver'
				}else if (index === 2) {
					return 'iconfont icon-jiangbei1 rank-copper'
				}else {
					return ''
				}
			},
			getRankText(index) {
				if (index > 2) {
					return index + 1
				}
			},
		}
	}
</script>

<style lang="less" scoped>
	.item {
		display: flex;
		position: relative;
		align-items: center;
		padding: 10px 20px;
		border-bottom: 1px solid rgb(228, 228, 228);
		background: #ccc;
		.num, .rank {
			flex: 0 0 50px;
			margin-right: 40px;
		    width: 50px;
		    text-align: center;
		}
		.rank-gold {
			color: rgb(255, 215, 0);
		}
		.rank-silver {
			color: rgb(233, 233, 216);
		}
		.rank-copper {
			color: rgb(186, 110, 64);
		}
		.desc {
			flex: 1;
			h3 {
				font-weight: 400;
			}
			p {
				font-size: 12px;
				color: #9B9B9B;
			}
		}
	}
</style>
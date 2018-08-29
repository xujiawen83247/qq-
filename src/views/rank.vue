<template>
    <div class="rank" ref="rank">
        <scroll class="toplist" :data="toplist" ref="toplist">
			<div>
				<h3 class="title">QQ音乐巅峰榜</h3>
				<ul class="rank-list">
					<li class="rank-item" v-for="(item,index) in toplist" :key="item.id" @click="selectItem(item)">
						<div class="item-left">
							<img class="bg" :src="item.picUrl"/>
							<div class="i-num">
								<i class="iconfont icon-yinle yinle"></i>
								<span class="play-num">{{(item.listenCount / 10000).toFixed(1)}}万</span>
							</div>
							<div class="i-play">
								<i class="iconfont icon-bofang bofang"></i>
							</div>
						</div>
						<div class="item-right">
							<ul class="song-list">
								<li class="song" v-for="(songs,index) in item.songList" :key="index">
									<span class="num">{{index + 1}}</span>
									<span class="song-name">{{songs.songname}}</span>
									<span class="fg">-</span>
									<span class="name">{{songs.singername}}</span>
								</li>
							</ul>
							<i class="iconfont icon-jiantou jiantou"></i>
						</div>
					</li>
				</ul>
			</div>
        </scroll>
        <router-view></router-view>
    </div>
	

</template>

<script>
	import {getTopList} from '@/api/recommend'
	import {ERR_OK} from '@/api/config.js'
	import Scroll from '@/base/scroll/scroll'
	import {playlistMixin} from '@/js/mixin'
	import {mapMutations} from 'vuex'
	
    export default {
		mixins: [playlistMixin],
		data() {
			return {
				toplist: []
			}
		},
        created() {
        	this._getTopList()
			
        },
		methods: {
			handlePlaylist(playlist) {
				// const bottom = playlist.length ? '15vw' : ''
				const height = playlist.length ? '81vh' : ''
				// this.$refs.rank.style.bottom = bottom
				this.$refs.rank.style.height = height
				this.$refs.toplist.refresh()
			},
			_getTopList() {
				getTopList().then((res) => {
					if (res.code === ERR_OK) {
						this.toplist = res.data.topList
					}
				})
			},
			selectItem(item) {
				this.$router.push({
					path: `/rank/${item.id}`
				})
				this.setTopList(item)
			},
			...mapMutations({
				setTopList: 'SET_TOP_LIST'
			})
		},
		components: {
			Scroll,
		},
    }
</script>

<style lang="less" scoped>
    .rank {
        position: relative;
        height: 88.5vh;
        overflow: hidden;
        background: #f4f4f4;
		
        .toplist {
            height: 100%;
        }
        .title {
            height: 130px;
            line-height: 130px;
            font-weight: 600;
            font-size: 40px;
            text-align: center
        }
        .rank-list {
            padding: 0 39px;
            .rank-item {
                display: flex;
                flex-direction: row;
                margin-bottom: 40px;
                height: 276px;
                background: #fff;
                overflow: hidden;
                .item-left {
                    position: relative;
                    -border: 1px solid red;
                    width: 284px;
                    height: 276px;
                    box-sizing: border-box;
                    .bg {
                        width: 100%;
                        height: 100%;
                    }
                    .i-num {
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                        position: absolute;
                        left: 0;
                        bottom: 0;
                        padding: 14px;
                        opacity: 0.8;
                        color: #fff;
                        .yinle {
                            margin-right: 10px;
                            font-size: 25px;
                        }
                        .play-num {
                            font-size: 22px;
                        }
                    }
                    .i-play {
                        position: absolute;
                        right: 0;
                        bottom: 0;
                        padding: 10px;
                        .bofang {
                            font-size: 60px;
                            color: #fff;
							opacity: 0.8;
                        }
                        
                    }
                }
                .item-right {
					display: flex;
                    flex: 1;
                    position: relative;
                    padding-left: 28px;
                    .song-list {
                        padding-top: 5px;
                        .song {
                            display: flex;
							width: 600px;
                            flex-direction: row;
                            font-size: 14px;
                            line-height: 95px;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							word-break: break-all;
                            .num, .song-name, .fg {
                                font-weight: 600;
                            }
                            .num {
                                margin-right: 20px;
                            }
                            .song-name {
                                margin-right: 12px;
                            }
                            .fg {
                                margin-right: 12px;
                            }
                            .name {
                                color: #808080;
                            }
                        }
                    }
                    .jiantou {
                        position: absolute;
                        right: 26px;
                        top: 50%;
                        transform: translateY(-50%);
                        font-size: 60px;
                        font-weight: bold;
                        color: #6e6e6e;
                    }
                }
            }
        }
    }
	

    
      
</style>


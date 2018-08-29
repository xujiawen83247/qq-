<template>
    <div>
        <slider v-if="banner.length" :data="banner"></slider>
				<div class="recommend" ref="recommend">
					<scroll :data="songList" class="scroll" ref="scroll">
							<div class="nodWrapper">
									<div class="mod">
											<h3>电台</h3>
											<ul class="radio-wrapper">
													<li class="js-play-radio" v-for="radlist in radioList" :key="radlist.radioid">
															<a href="javascript:;">
																	<div class="list-media">
																			<img v-lazy="radlist.picUrl"/>
																			<span></span>
																	</div>
																	<div class="list-info">
																			<p class="list-title">{{radlist.Ftitle}}</p>
																	</div>
															</a>
													</li>
											</ul>
									</div>
									<div class="mod">
											<h3>热门歌单</h3>
											<ul class="radio-wrapper">
													<li class="js-play-radio" v-for="songs in songList" :key="songs.id">
															<a href="javascript:;" @click="selectItem(songs)">
																	<div class="list-media">
																			<img v-lazy="songs.picUrl"/>
																			<span></span>
																	</div>
																	<div class="list-info">
																			<p class="list-title">{{songs.songListDesc}}</p>
																			<span class="name">{{songs.songListAuthor}}</span>
																	</div>
															</a>
													</li>
											</ul>
									</div>
							</div>
							<div class="loading" v-show="!songList.length">
									<loading></loading>
							</div>
					</scroll>
				</div>
        <router-view></router-view>
        
        
    </div>
</template>

<script>
import {getRecommend,getDiscList} from '@/api/recommend'
import {ERR_OK} from '@/api/config'
import Slider from '@/base/slider/slider'
import Scroll from '@/base/scroll/scroll'
import Loading from '@/components/loading'
import {playlistMixin} from '@/js/mixin'
import {mapMutations} from 'vuex'

export default {
	mixins: [playlistMixin],
   data(){
       return {
           data: [],
           banner: [],
           radioList: [],
           songList: []
       }
   },
    created(){
        this._getRecommend()
    },
    methods: {
			handlePlaylist(playlist) {
				const bottom = playlist.length > 0 ? '14vw' : ''
				this.$refs.recommend.style.bottom = bottom
				this.$refs.scroll.refresh()
			},
        _getRecommend() {
            getRecommend().then((res)=>{
                if(res.code === ERR_OK){
                    console.log(res.data)
                    this.banner = res.data.slider
                    this.radioList = res.data.radioList
                    this.songList = res.data.songList
                }
            })
        },
      selectItem(songs) {
				this.$router.push({
					path: `/home/${songs.id}`
				})
				this.setDisc(songs)
				// console.log(songs)
			},
			...mapMutations({
				setDisc: 'SET_DISC'
			})
    },
    components: {
        Slider,
        Scroll,
        Loading
    }
}
</script>

<style lang="less" scoped>
	.recommend {
		position: relative;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
	.nodWrapper {
		
	}
    .mod {
        padding: 0 26px;
        h3 {
            padding: 10px;
            height: 128px;
            font: 40px/128px "微软雅黑";
            font-weight: 600;
        }
        .radio-wrapper {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            .js-play-radio {
                
                margin-bottom: 10px;
                overflow: hidden;
                img {
                    width: 504px;
                    height: 505px;
                }
                .list-info {
                    width: 500px;
                    height: 120px;
                    background: #fff;
                    
                    .list-title {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        padding-top: 16px;
                        color: #333;
                        font-size: 34px;
                    }
                }
            }
        }
    }
    .scroll {
        position: relative;
		
        height: 70vh;
        overflow: hidden;
        .loading {
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
</style>

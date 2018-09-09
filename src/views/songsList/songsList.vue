<template>
    <div>
        <scroll :data="songsList" ref="scroll" class="scroll">
            <div>
                <ul class="discList">
                    <li class="discList-item" v-for="item in songsList" :key="item.dissid">
                        <div class="discList-img">
                            <img v-lazy="item.imgurl"/>
                        </div>
                        <div class="discList-info">
                            <h3 v-html="item.creator.name" class="name"></h3>
                            <p v-html="item.dissname" class="text"></p>
                        </div>
                    </li>
                </ul>
            </div>
        </scroll>
        
    </div>
</template>

<script>
import {getDiscList} from '@/api/recommend'
import Scroll from '@/base/scroll/scroll'
export default {
    data() {
        return {
            songsList: []
        }
    },
    created(){
        this._getDiscList()
    },
    components: {
        Scroll
    },
    methods: {
        _getDiscList(){
            getDiscList().then((res)=>{
                this.songsList = res.data.list
            })
        }
    }
}
</script>

<style lang="less" scoped>
    .discList {
        padding: 50px;
       .discList-item {
           position: relative;
           margin-bottom: 38px;
           overflow: hidden;
          .discList-img {
              float: left;
              width: 285px;
              height: 282px;
              img {
                  width: 285px;
                  height: 282px;
              }
          }
          .discList-info {
              float: left;
              margin-left: 50px;
              width: 50%;
              .name {
                  font: 48px/108px "微软雅黑";
                  font-weight: 400;
              }
              .text {
                  font-size: 40px;
                  color: #9b9b9b;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
              }
          } 
       } 
    }
    .scroll {
        height: 1700px;
        overflow: hidden;
    }
</style>

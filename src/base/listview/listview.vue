<template>
    <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll" :probeType="probeType">
        <ul>
            <li class="list-group" v-for="group in data" :key="group.id" ref="listviewGroup">
                <h3 class="list-group-title">{{group.title}}</h3>
                <ul>
                    <li @click="selectItemHandle(item)" class="list-group-item" v-for="item in group.items" :key="item.id">
                        <img class="avatar" v-lazy="item.avatar"/>
                        <span class="name">{{item.name}}</span>
                    </li>
                </ul>
            </li>
        </ul>
        <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcuTouchMove">
            <ul>
                <li class="item" v-for="(item, index) in shortcutList" :key="index" :data-index="index" :class="{current: currentIndex === index}">{{item}}</li>
            </ul>
        </div>

        <div class="fiex-title" v-show="fiexTitle" ref="fiexTitle">
            {{fiexTitle}}
        </div>
    </scroll>
</template>

<script>
import Scroll from '@/base/scroll/scroll'
import {getData} from '@/js/dom.js'
const ANCHOR_HEIGHT = 20
const TITLE_HEIGHT = 30
export default {
    props: {
        data: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            currentIndex: 0,
            scrollY: -1,
            diff: 1,
        }
    },
    created() {
        this.touch = {}
        this.listenScroll = true
        this.listHeight = []
        this.probeType = 3
    },
    computed: {
        shortcutList () {
            return this.data.map((item) => {
                return item.title.substr(0, 1)
            })
        },
        fiexTitle() {
            if (this.scrollY > 0) {
                return ''
            }
            return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
        }
    },
    methods: {
        selectItemHandle(item) {
					this.$emit('select', item)
        },
        onShortcutTouchStart(e) {
            let anchorIndex = getData(e.target, 'index')
            let firstTouch = e.touches[0]
            this.touch.y1 = firstTouch.pageY
            this.touch.anchorIndex = anchorIndex
            this._scrollTo(anchorIndex)
        },
        onShortcuTouchMove(e) {
            let firstTouch = e.touches[0]
            this.touch.y2 = firstTouch.pageY
            let delta = (this.touch.y2 - this.touch.y1)/ANCHOR_HEIGHT | 0
            let anchorIndex = parseInt(this.touch.anchorIndex) + delta +1
            this._scrollTo(anchorIndex) 
         },
				 refresh() {
					 this.$refs.listview.refresh()
				 },
        scroll(pos) {
            this.scrollY = pos.y
        },
        _scrollTo(index) {
            if (!index && index != 0) {
                return
            }
            if (index < 0) {
                index = 0
            }else if (index > this.listHeight.length - 2) {
                index = this.listHeight.length - 2 
            }
            this.scrollY = -this.listHeight[index]
            this.$refs.listview.scrollToElement(this.$refs.listviewGroup[index], 400)
        },
        _calculateHeight() {
            this.listHeight = []
            const list = this.$refs.listviewGroup
            let height = 0
            this.listHeight.push(height)
            for (let i=0;i<list.length;i++) {
                height += list[i].clientHeight
                this.listHeight.push(height)
            }
        }
    },
    watch: {
        data() {
            setTimeout(() => {
                this._calculateHeight()
            }, 20)
        },
        scrollY(newY) {
            const listHeight = this.listHeight
            //当滚动到顶部，newY > 0
            if (newY > 0) {
                this.anchorIndex = 0
                return
            }
            //在中间部分滚动
            for (let i=0;i<listHeight.length-1;i++) {
                let height1 = listHeight[i]
                let height2 = listHeight[i+1]
                if (-newY >= height1 && -newY < height2) {
                    this.currentIndex = i
                    this.diff = height2 + newY
                    return
                }
            }
            //当滚动到底部，且-newY大于最后一个元素的上线
            this.currentIndex = listHeight.length - 2
        },
        diff(newVal) {
            let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
            if (this.fixedTop === fixedTop) {
                return
            }
            this.fixedTop = fixedTop
            this.$refs.fiexTitle.style.transform = `translate3d(0,${fixedTop}px,0)`
        }
    },
    components: {
        Scroll,
    }
}
</script>

<style scoped lang="less">
   .listview {
       position: relative;
       height: 100%;
       overflow: hidden;
       .list-group {
           padding: 0 0 10px 0;
           .list-group-title {
               padding-left: 50px;
               padding-bottom: 20px;
               height: 60px;
               line-height: 80px;
               font-size: 30px;
               color: #fff;
               background: #ccc;
           }
           .list-group-item {
                display: flex;
                align-items: center;
                padding: 5px 0;
                margin: 0 5px;
                border-bottom: 1px solid rgb(228, 228, 228);
                &:last-child {
                    border: none;
                    margin-bottom: 10px;
                }
                .avatar {
                    width: 200px;
                    height: 200px;
                    border-radius: 4px;
                }
                .name {
                    margin-left: 20px;
                    color: #333;
                    font-size: 12px;
                }
            }
       }
        .list-shortcut {
            position: absolute;
            top: 50%;
            right: 4px;
            transform: translateY(-50%);
            width: 50px;
            text-align: center;
            font-family: Arial, Helvetica, sans-serif;
            .item {
                padding: 5px 5px;
                line-height: 1;
                color: #333;
                font-weight: bold;
                font-size: 16px;
                &.current {
                    
                    color: red;
                }
            }
        }
        .fiex-title {
            position: absolute;
            top: 0;
            left: 0;
            padding-left: 50px;
            padding-bottom: 20px;
            width: 100%;
            height: 60px;
            line-height: 80px;
            font-size: 30px;
            color: #fff;
            background: #ccc;
        }
   } 
</style>

<template>
    <div>
        <div class="slider" ref="slider">
            <ul class="sliderGroup" ref="sliderGroup">
                <li v-for="item in data" :key="item.id" class="slider-item">
                    <a :href="item.linkUrl">
                        <img :src="item.picUrl" />
                    </a>
                </li>
            </ul>
            <div>
                <ul class="dost">
                    <li v-for="(item,index) in dost" :key="index" class="dost-item" :class="{active: currentPageIndex === index}"></li>
                </ul>
            </div>
        </div>
        
    </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
    props: ['data'],
    data() {
        return {
            loop: {
                type: Boolean,
                default: true
            },
            autoPlay: {
                type: Boolean,
                default: true
            },
            interval: {
                type: Number,
                default: 4000
            },
            dost: [],
            currentPageIndex: 0,
        }
    },
    
    mounted() {
        setTimeout(()=>{
            this._setSliderWidth()
            this._initDost()    //注意_setSliderWidth 在初始化后会在前后各加一张图以保证无缝图片切换，所以dost需要在初始化前进行获取元素个数
            this._initSlider()
            if(this.autoPlay) {
                this._play()
            }
        },20)
        window.addEventListener('resize',()=>{
            if(!this.slider) {
                return
            }
            this._setSliderWidth(true)
            this.slider.refresh()
        })
    },
    methods: {
        _setSliderWidth(isResize) {
            this.children = this.$refs.sliderGroup.children
            
            let width = 0
            let sliderWidth = this.$refs.slider.clientWidth
            for(let i=0;i<this.children.length;i++) {
                this.children[i].style.width = sliderWidth+'px'
                width += sliderWidth
            }
            if(this.loop && !isResize) {
                width += 2*sliderWidth
            }
            this.$refs.sliderGroup.style.width = width+'px'
        },
        _initDost() {
            this.dost = new Array (this.children.length)
        },
        _initSlider() {
            this.slider = new BScroll(this.$refs.slider, {
                click: true,
                scrollX: true,
                scrollY: false,
                momentum: false,
                snap: {
                    loop: true,
                    threshold: 0.3,
                    speed: 400
                },
                bounce: false,
                stopPropagation: true,
            })
            this.slider.on('scrollEnd',()=>{
                let pageIndex = this.slider.getCurrentPage().pageX
                // if(this.loop) {
                //     pageIndex -= 1
                // }
                this.currentPageIndex = pageIndex
                if(this.autoPlay) {
                    this._play()
                }
            })
        },
        _play() {
            let pageIndex = this.currentPageIndex +1 
            // if(this.loop) {
            //     pageIndex += 1
            // }
            clearTimeout(this.time)
            this.time = setTimeout(()=>{
                this.slider.goToPage(pageIndex,0,400)
            },4000)
        }
    },
    destroyed() {
        clearTimeout(this.time)
    }
}
</script>

<style lang="less">
.slider{
    position: relative;
    overflow: hidden;
    width: 100vw;
}
.sliderGroup {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-item {
        float: left;
        box-sizing: border-box;
        text-align: center;
        height: 434px;
        a {
            display: block;
            overflow: hidden;
            img {
                display: block;
                height: 434px;
            }
        }
        
    }
}
.dost {
    position: absolute;
    left: 40%;
    bottom: 30px;
    text-align: center;
    .dost-item {
        float: left;
        border-radius: 50%;
        margin-left: 10px;
        width: 30px;
        height: 30px;
        background: #fff;
        &.active {
            border-radius: 10px;
            width: 50px;
            background: #fff;
            transition: .3s;
        }
    }
}
</style>


<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn"
				@touchstart.prevent="progressTouchStart"
				@touchmove.prevent="progressMove"
				@touchend="progressEnd"
			>
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>
    
<script>
const progressBtnWidth = 10
export default {
    props: {
        percent: {
            tpye: Number,
            default: 0
        }
    },
	created() {
		this.touch = {}
	},
	methods: {
		progressTouchStart(e) {
			this.touch.initiated = true	//表示初始化
			this.touch.startX = e.touches[0].pageX
			this.touch.left = this.$refs.progress.clientWidth
		},
		progressMove(e) {
			if (!this.touch.initiated) {
				return
			}
			const deltaX = e.touches[0].pageX - this.touch.startX
			const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
			this._offset(offsetWidth)
		},
		progressEnd() {
			this.touch.initiated = false
			this._triggerPercent()
		},
		progressClick(e) {
			// this._offset(e.offsetX)
			const rect = this.$refs.progressBar.getBoundingClientRect()
			const offsetWidth = e.pageX - rect.left
			this._offset(offsetWidth)
			this._triggerPercent()
		},
		_triggerPercent() {
			const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
			const percent = this.$refs.progress.clientWidth / barWidth
			this.$emit('percentChange', percent)
		},
		_offset(offsetWidth) {
			this.$refs.progress.style.width = `${offsetWidth}px`
			this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
		}
	},
    watch: {
        percent(newPercent) {
            if (newPercent >= 0 && !this.touch.initiated) {
                const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
                const offsetWidth = newPercent * barWidth
                this._offset(offsetWidth)
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .progress-bar {
        height: 30px;
        .bar-inner {
            position: relative;
            top: 13px;
            height: 4px;
            width: 100%;
            background: rgba(0, 0, 0, 0.3);
            .progress {
                position: absolute;
                height: 100%;
                background: #31c27c;
            }
            .progress-btn-wrapper {
                position: absolute;
                left: -8px;
                top: -20px;
                width: 30px;
                height: 30px;
                .progress-btn {
                    position: absolute;
                    top: 7px;
                    left: 7px;
                    box-sizing: border-box;
                    border: 5px solid #fff;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    background: #31c27c;
                }
            }
        }
    }
</style>

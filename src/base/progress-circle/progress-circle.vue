<template>
    <div class="progress-circle">
        <svg :width="radiusW" :height="radiusH" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent" />
            <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"/>
        </svg>
        <slot></slot>
    </div>
</template>

<script>
export default {
	data() {
		return {
			dashArray : Math.PI * 100
		}
	},
    props: {
		radiusW: {
			type: Number,
			default: 50
		},
		radiusH: {
			type: Number,
			default: 50
		},
		percent: {
			type: Number,
			default: 0
		}
	},
	computed: {
		dashOffset() {
			return (1 - this.percent) * this.dashArray
		}
	},
}
</script>
<!--&.progress-background是底色，&.progress-bar是进度条颜色，stroke-dasharray是底色的长度，stroke-dashoffset是进度条的长度-->
<style lang="less" scoped>
    .progress-circle {
        position: relative;
        circle {
            stroke-width: 30px;
            transform-origin: center;
            &.progress-background {
                transform: scale(0.9);
                stroke: #9b9b9b;
            }
            &.progress-bar {
                transform: scale(0.9) rotate(-90deg);
                stroke: #31c27c;
            }
        }
    }
</style>

<template>
	<div class="no-result">
		<div class="no-result-icon">
			<i class="iconfont icon-wusousuojieguo"></i>
		</div>
		<p class="no-result-text">{{title}}</p>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		},
	}
</script>

<style lang="less" scoped="scoped">
	.no-result {
		text-align: center;
		color: #C8C8C8;
		.icon-wusousuojieguo {
			font-size: 150px;
		}
		.no-result-text {
			margin-top: 30px;
		}
	}
</style>
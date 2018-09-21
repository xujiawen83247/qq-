<template>
  <div id="app">
    <div class="header">
      <img src="./assets/logo.png" class="logo" />
      <!-- <a href="javascript:;" class="down">下载APP</a> -->
      <router-link :to="{name: 'User'}" class="mine" tag="div">
        <i class="iconfont icon-yonghu"></i>
      </router-link>
    </div>
    <div class="nav">
      <router-link :to="{name: 'Home'}" class="nav-link" >推荐</router-link>
      <router-link :to="{name: 'Singer'}" class="nav-link" >歌手</router-link>
      <router-link :to="{name: 'Rank'}" class="nav-link">排行榜</router-link>
      <router-link :to="{name: 'Search'}" class="nav-link">搜索</router-link>
    </div>
    <keep-alive>
      <router-view/>
    </keep-alive>
		
		<play></play>
  </div>
</template>

<script>
	import play from '@/views/player/player'
export default {
  name: 'App',
	components: {
		play,
	}
}
</script>

<style lang="less">
html,body,#app {
  height: 100%;
}
#app {
  position: fixed;
  top: 0;
  width: 100%;
  overflow: hidden;
}
.header {
  height: 116px;
  background: #31c37c;
	z-index: 99;
  .logo {
    float: left;
    margin-top: 24px;
    margin-left: 26px;
    width: 238px;
    height: 66px;
  }
  .down {
    float: right;
    border-radius: 30px;
    margin-top: 21px;
    margin-right: 24px;
    width: 208px;
    height: 74px;
    background: #149c5a;
    font: 34px/74px "微软雅黑";
    text-align: center;
    color: #fff;
  }
  .mine {
    float: right;
    margin-top: 14px;
    .icon-yonghu {
      font-size: 80px;
    }
  }
}
.nav {
  display: flex;
  height: 104px;
  background: #fff;
	z-index: 99;
  .nav-link {
    flex: 1;
    font: 38px/104px "微软雅黑";
    text-align: center;
    color: #666;
  }
  .router-link-active {
    border-bottom: 4px solid #30c37c;
    color: #30c37c;
  }
}


</style>
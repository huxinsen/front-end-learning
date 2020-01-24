<template>
  <div id="app">
    <span>hello </span>

    <!-- 使用 router-link 组件来导航 -->
    <!-- 通过传入 `to` 属性指定链接 -->
    <!-- <router-link> 默认会被渲染成一个 `<a>` 标签 -->
    <router-link to="/home">首页</router-link>
    <span> | </span>
    <router-link to="/about">关于</router-link>

    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  mounted() {
    console.log(this.$router, this.$route); // eslint-disable-line
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

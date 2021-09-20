<template>
  <router-view/>
</template>

<script setup lang="ts">

import HelloWorld from '@/components/HelloWorld.vue'


// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>

*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body{
  height: 100%;
}
html, body, #app{
  min-width: 1200px;
  min-height: 100%;
  position: relative;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333333;
  height: 100%;
}

</style>

<style lang="less">
@import url('./styles/common.less');
</style>

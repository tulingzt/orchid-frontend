<!-- src/App.vue -->
<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style lang="scss">
#app {
  height: 100vh;
  background: #f5f7f9;
  
  .page-container {
    padding: 20px;
    background: #fff;
    border-radius: 4px;
    margin: 16px;
  }
}
</style>
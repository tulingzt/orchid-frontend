<!-- src/views/NotFound.vue -->
<template>
    <div class="not-found">
      <h1>404 - 页面不存在</h1>
      <el-button @click="$router.push('/')">返回首页</el-button>
    </div>
  </template>
  
  <style scoped>
  .not-found {
    text-align: center;
    padding: 100px;
  }
  </style>
<template>
  <!-- Footer info placed at the bottom of the sidebar -->
  <div class="sidebar-footer">
    <p>关于集智 意见反馈</p>
    <p>京ICP备17009874号-1</p>
    <p>© 2009-{{ new Date().getFullYear() }} 集智俱乐部版权所有</p>
  </div>
</template>

<style scoped>
.sidebar-footer {
  text-align: center;
  padding: 20px 12px;
  color: var(--swarma-text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

.sidebar-footer p {
  margin: 4px 0;
}
</style>


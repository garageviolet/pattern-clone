<template>
  <section class="placeholder">
    <h1>{{ title }}</h1>
    <p>该页面尚未上线，敬请期待。</p>
    <a-button type="primary" @click="goHome">返回首页</a-button>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const title = computed(() => route.meta.title ?? '内容筹备中')

const goHome = () => {
  router.push('/reading-club')
}
</script>

<style scoped>
.placeholder {
  background: #fff;
  border-radius: 20px;
  padding: 48px;
  box-shadow: 0 24px 60px rgba(16, 31, 48, 0.08);
  text-align: center;
}

h1 {
  margin-bottom: 12px;
  color: var(--swarma-text-title);
}

p {
  color: var(--swarma-text-secondary);
  margin-bottom: 24px;
}
</style>


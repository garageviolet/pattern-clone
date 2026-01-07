<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import BaseLayout from './layouts/BaseLayout.vue'

const theme = {
  token: {
    colorPrimary: '#61f4de',
    borderRadius: 12,
    fontSize: 14,
  },
}
</script>

<template>
  <ConfigProvider :theme="theme">
    <BaseLayout />
  </ConfigProvider>
</template>

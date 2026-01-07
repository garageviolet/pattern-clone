<template>
  <a-card class="path-card" :body-style="{ padding: '24px' }">
    <div class="path-head">
      <span class="level">{{ path.level }}</span>
      <span class="duration">{{ path.durationWeeks }} 周</span>
    </div>
    <h3>{{ path.title }}</h3>
    <p class="desc">{{ path.description }}</p>
    <div class="topics">
      <a-tag v-for="topic in path.topics" :key="topic" color="cyan">
        {{ topic }}
      </a-tag>
    </div>
    <div class="meta">
      <div>
        <small>导师</small>
        <p>{{ path.mentor }}</p>
      </div>
      <div>
        <small>资源</small>
        <p>{{ path.resources }} 篇</p>
      </div>
    </div>
    <a-progress :percent="path.progress" stroke-color="#61f4de" />
  </a-card>
</template>

<script setup lang="ts">
import type { LearningPath } from '../types/content'

defineProps<{
  path: LearningPath
}>()
</script>

<style scoped>
.path-card {
  border: 1px solid var(--swarma-dividers);
  border-radius: 18px;
  background: #fff;
  color: var(--swarma-text-primary);
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 18px 30px rgba(15, 31, 48, 0.06);
}

.path-head {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}

.level {
  color: var(--swarma-primary);
}

.desc {
  margin: 0;
  color: var(--swarma-text-secondary);
  line-height: 1.5;
}

.topics {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.meta {
  display: flex;
  gap: 32px;
  font-size: 13px;
}

.meta small {
  color: var(--swarma-text-secondary);
  font-size: 12px;
}

.meta p {
  margin: 4px 0 0;
  font-weight: 500;
}
</style>


<template>
  <a-card :body-style="{ padding: '24px' }" class="session-card">
    <div class="card-head">
      <span class="badge">{{ session.statusLabel }}</span>
      <span class="date">{{ session.countdown }}</span>
    </div>
    <h3>{{ session.title }}</h3>
    <p class="summary">
      {{ session.summary }}
    </p>
    <div class="tags">
      <a-tag v-for="tag in session.tags" :key="tag" color="blue">
        {{ tag }}
      </a-tag>
    </div>
    <div class="hashtags">
      <span v-for="tag in session.hashtags" :key="tag">{{ tag }}</span>
    </div>
    <div class="card-actions">
      <a-button type="link">了解详情</a-button>
      <a-button type="primary" shape="round" ghost>预约 / 回放</a-button>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import type { ReadingClubSession } from '../types/content'

defineProps<{
  session: ReadingClubSession
}>()
</script>

<style scoped>
.session-card {
  border: 1px solid var(--swarma-dividers);
  border-radius: 18px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 18px 30px rgba(15, 31, 48, 0.06);
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.badge {
  background: rgba(24, 144, 255, 0.1);
  color: var(--swarma-primary);
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
}

.date {
  font-size: 13px;
}

h3 {
  margin: 12px 0 8px;
  font-size: 20px;
}

.speaker {
  margin: 0;
  opacity: 0.8;
}

.summary {
  margin: 4px 0 12px;
  line-height: 1.5;
  color: var(--swarma-text-secondary);
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.hashtags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--swarma-text-secondary);
  font-size: 12px;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}
</style>


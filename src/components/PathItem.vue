<template>
  <article class="path-item">
    <!-- Header: Blue hexagon badge icon + Title -->
    <div class="path-header">
      <span class="path-icon">
        <svg viewBox="0 0 24 24" width="20" height="20">
          <!-- 8-cornered rounded badge -->
          <path d="M12 1.5 C13.5 1.5 14.5 2.5 15.5 3.5 L16.5 3.5 C18.5 3.5 20.5 5.5 20.5 7.5 L20.5 8.5 C21.5 9.5 22.5 10.5 22.5 12 C22.5 13.5 21.5 14.5 20.5 15.5 L20.5 16.5 C20.5 18.5 18.5 20.5 16.5 20.5 L15.5 20.5 C14.5 21.5 13.5 22.5 12 22.5 C10.5 22.5 9.5 21.5 8.5 20.5 L7.5 20.5 C5.5 20.5 3.5 18.5 3.5 16.5 L3.5 15.5 C2.5 14.5 1.5 13.5 1.5 12 C1.5 10.5 2.5 9.5 3.5 8.5 L3.5 7.5 C3.5 5.5 5.5 3.5 7.5 3.5 L8.5 3.5 C9.5 2.5 10.5 1.5 12 1.5 Z" fill="#1890ff"/>
          <!-- White V letter -->
          <path d="M9 9L12 15L15 9" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </span>
      <h3 class="path-title">{{ path.title }}</h3>
    </div>

    <!-- Body: Cover image left, content right -->
    <div class="path-body">
      <!-- Cover Image -->
      <div class="cover-section">
        <img :src="path.cover" :alt="path.title" />
      </div>

      <!-- Content Section -->
      <div class="content-section">
        <!-- Author info -->
        <div class="author-row">
          <a-avatar :src="path.author.avatar" :size="32" class="author-avatar">
            {{ path.author.name[0] }}
          </a-avatar>
          <span class="author-name">{{ path.author.name }}</span>
        </div>

        <!-- Description text -->
        <div class="description">
          <p>{{ path.content || path.description }}</p>
        </div>

        <!-- Interactions: likes, comments, time -->
        <div class="interactions">
          <span class="interaction-item">
            <LikeOutlined />
            <span>{{ path.likes }}</span>
          </span>
          <span class="interaction-item">
            <MessageOutlined />
            <span>{{ path.comments }}</span>
          </span>
          <span class="time-ago">{{ path.timeAgo }}</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { LikeOutlined, MessageOutlined } from '@ant-design/icons-vue'
import type { LearningPath } from '../types/content'

defineProps<{
  path: LearningPath
}>()
</script>

<style scoped>
.path-item {
  --item-side-gap: 20px;
  position: relative;
  padding: 20px var(--item-side-gap);
  background: #fff;
}

/* Divider line */
.path-item::after {
  content: '';
  position: absolute;
  left: var(--item-side-gap);
  right: var(--item-side-gap);
  bottom: 0;
  height: 1px;
  background: var(--swarma-dividers);
}

.path-item:last-child::after {
  display: none;
}

/* Header: Icon + Title */
.path-header {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;
}

.path-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
}

.path-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--swarma-text-title);
  line-height: 1.5;
  flex: 1;
}

/* Body: Two-column layout */
.path-body {
  display: flex;
  gap: 20px;
}

/* Cover image section */
.cover-section {
  width: 200px;
  height: 150px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: linear-gradient(180deg, #f9f9f9, #ececec);
}

.cover-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Content section */
.content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Author row */
.author-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-avatar {
  flex-shrink: 0;
}

.author-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--swarma-text-title);
}

/* Description */
.description {
  color: var(--swarma-text-primary);
  font-size: 14px;
  line-height: 1.7;
  flex: 1;
}

.description p {
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Interactions */
.interactions {
  display: flex;
  align-items: center;
  gap: 20px;
  color: var(--swarma-text-secondary);
  font-size: 14px;
}

.interaction-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: color 0.2s;
}

.interaction-item :deep(.anticon) {
  font-size: 16px;
}

.interaction-item:hover {
  color: var(--swarma-primary);
}

.time-ago {
  color: var(--swarma-text-secondary);
}

@media (max-width: 768px) {
  .path-body {
    flex-direction: column;
  }

  .cover-section {
    width: 100%;
    height: 180px;
  }
}
</style>

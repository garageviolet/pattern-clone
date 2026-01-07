<template>
  <article class="paper-item">
    <!-- Paper header: Title (English + Chinese) -->
    <div class="paper-header">
      <div class="paper-icon">
        <img src="https://pattern.swarma.org/static/pattern/main/images/entropy-logo.png" alt="journal" />
      </div>
      <div class="paper-titles">
        <h3 class="title-en">{{ paper.title }}</h3>
        <p class="title-cn" v-if="paper.titleCn">{{ paper.titleCn }}</p>
      </div>
    </div>

    <!-- Meta info: Journal, Authors, Date -->
    <div class="paper-meta">
      <span class="journal" v-if="paper.journal">{{ paper.journal }}</span>
      <span class="separator" v-if="paper.journal">•</span>
      <span class="authors">{{ paper.authors.join(', ') }}</span>
      <span class="separator">•</span>
      <span class="date">{{ paper.date }}</span>
    </div>

    <!-- Thumbnails -->
    <div class="paper-thumbnails" v-if="paper.thumbnails && paper.thumbnails.length">
      <img 
        v-for="(thumb, index) in paper.thumbnails.slice(0, 7)" 
        :key="index" 
        :src="thumb" 
        :alt="`Figure ${index + 1}`"
        class="thumbnail"
      />
    </div>

    <!-- Chinese abstract (shown by default, unless hideAbstractByDefault is true) -->
    <div class="paper-abstract paper-abstract-cn" v-if="paper.abstract && (!hideAbstractByDefault || showAbstract)">
      <p>{{ paper.abstract }}</p>
    </div>

    <!-- Abstract toggle -->
    <div class="abstract-toggle" v-if="(hideAbstractByDefault && paper.abstract) || paper.abstractEn">
      <a href="#" @click.prevent="showAbstract = !showAbstract" class="toggle-link">
        {{ showAbstract ? '收起摘要' : '展示摘要' }}
      </a>
    </div>

    <!-- English abstract content (shown when expanded, only for non-hideAbstractByDefault mode) -->
    <div class="paper-abstract paper-abstract-en" v-if="showAbstract && paper.abstractEn && !hideAbstractByDefault">
      <p>{{ paper.abstractEn }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ResearchPaper } from '../types/content'

defineProps<{
  paper: ResearchPaper
  hideAbstractByDefault?: boolean
}>()

const showAbstract = ref(false)
</script>

<style scoped>
.paper-item {
  padding: 20px;
  background: #fff;
  border-bottom: 1px solid var(--swarma-dividers);
}

.paper-item:last-child {
  border-bottom: none;
}

/* Header: Icon + Titles */
.paper-header {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.paper-icon {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
}

.paper-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.paper-titles {
  flex: 1;
}

.title-en {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
  color: var(--swarma-text-title);
  line-height: 1.5;
}

.title-cn {
  margin: 0;
  font-size: 14px;
  color: var(--swarma-text-secondary);
  line-height: 1.5;
}

/* Meta info */
.paper-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 14px;
  color: var(--swarma-text-secondary);
  margin-bottom: 16px;
}

.journal {
  font-style: italic;
}

.separator {
  color: var(--swarma-text-disable);
}

/* Thumbnails */
.paper-thumbnails {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  overflow-x: auto;
}

.thumbnail {
  width: 100px;
  height: 75px;
  object-fit: cover;
  border: 1px solid var(--swarma-dividers);
  border-radius: 4px;
  flex-shrink: 0;
}

/* Abstract toggle */
.abstract-toggle {
  margin-bottom: 8px;
}

.toggle-link {
  font-size: 14px;
  color: var(--swarma-primary);
  text-decoration: none;
}

.toggle-link:hover {
  text-decoration: underline;
}

/* Abstract */
.paper-abstract {
  font-size: 14px;
  color: var(--swarma-text-primary);
  line-height: 1.7;
  background: #f9f9f9;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 12px;
}

.paper-abstract p {
  margin: 0;
}

/* Chinese abstract - default view */
.paper-abstract-cn {
  background: #f9f9f9;
}

/* English abstract - expanded view */
.paper-abstract-en {
  background: #f0f7ff;
  border-left: 3px solid var(--swarma-primary);
}
</style>


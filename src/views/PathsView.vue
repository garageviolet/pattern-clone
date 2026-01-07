<template>
  <section class="paths-layout">
    <div class="main-column">
      <header class="page-head">
        <p class="page-description">
          多个研究领域的经典论文清单,跨学科学习与研究的便捷路径
        </p>
      </header>
      <div class="surface-card paths-list">
        <a-spin :spinning="store.loading">
          <PathItem
            v-for="path in store.filteredPaths"
            :key="path.id"
            :path="path"
          />
          <a-empty v-if="!store.loading && store.filteredPaths.length === 0">
            <template #description> 暂无该层级的路径 </template>
          </a-empty>
          <!-- End of list message -->
          <div v-if="store.filteredPaths.length > 0 && !store.loading" class="end-message">
            <span>没有更多了</span>
          </div>
        </a-spin>
      </div>
    </div>
    <aside class="sidebar-column">
      <ReadingSidebarCalendar />
      <ReadingSidebarRanking />
      <ReadingSidebarEncyclopedia />
      <ReadingSidebarArticles />
      <ReadingSidebarCourses />
      <ReadingSidebarQRCode />
      <SidebarFooter />
    </aside>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PathItem from '../components/PathItem.vue'
import ReadingSidebarCalendar from '../components/ReadingSidebarCalendar.vue'
import ReadingSidebarRanking from '../components/ReadingSidebarRanking.vue'
import ReadingSidebarEncyclopedia from '../components/ReadingSidebarEncyclopedia.vue'
import ReadingSidebarArticles from '../components/ReadingSidebarArticles.vue'
import ReadingSidebarCourses from '../components/ReadingSidebarCourses.vue'
import ReadingSidebarQRCode from '../components/ReadingSidebarQRCode.vue'
import SidebarFooter from '../components/SidebarFooter.vue'
import { usePathsStore } from '../stores/paths'

const store = usePathsStore()

onMounted(() => {
  store.fetchPaths()
})
</script>

<style scoped>
.paths-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;
  position: relative;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.page-head {
  background: #fff;
  padding: 20px 24px;
  border-radius: 0;
  margin-bottom: 0;
}

.page-description {
  margin: 0;
  color: var(--swarma-text-primary);
  font-size: 14px;
  line-height: 1.6;
}

.paths-list {
  padding: 0;
  border-radius: 0;
  box-shadow: none;
  background: #fff;
}

.paths-list :deep(.ant-spin-container) {
  padding: 0;
}

/* End of list message */
.end-message {
  padding: 30px 20px;
  text-align: center;
  color: var(--swarma-text-secondary);
  font-size: 14px;
}

/* Hide divider on last item before end-message */
.path-item:last-of-type::after {
  display: none;
}

.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-self: flex-start;
}

@media (max-width: 1024px) {
  .paths-layout {
    grid-template-columns: 1fr;
  }

  .sidebar-column {
    align-self: flex-start;
  }
}
</style>


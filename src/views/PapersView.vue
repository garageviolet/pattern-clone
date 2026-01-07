<template>
  <section class="papers-layout">
    <div class="main-column">
      <!-- Tab navigation -->
      <div class="tabs-nav">
        <button 
          v-for="tab in tabs" 
          :key="tab.key" 
          :class="['tab-btn', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Header section - 复杂速递 tab -->
      <header v-if="activeTab === 'complexity'" class="page-head">
        <h1 class="page-title">Complexity Express</h1>
        <p class="page-subtitle">复杂性研究速递——复杂科学研究每日更新</p>
        <p class="page-description">
          <LikeOutlined /> 获高赞文章将有机会深度解读、重点推送与广泛讨论。
        </p>
        
        <a-button type="primary" class="subscribe-btn">
          <BookOutlined /> 一键订阅
        </a-button>
        
        <p class="subscribe-hint">
          点击即可追踪复杂性研究领域的最新论文。「集智斑图」微信服务号每周向你推送论文信息，论文不再错过！
        </p>
      </header>

      <!-- Header section - AI+Science tab -->
      <header v-if="activeTab === 'ai-science'" class="page-head">
        <h1 class="page-title">AI+Science Express - Top Journals</h1>
        <p class="page-subtitle">AI+Science研究速递——顶刊AI+Science研究每日更新</p>
      </header>

      <!-- Header section - arXiv tab -->
      <header v-if="activeTab === 'arxiv'" class="page-head">
        <p class="page-subtitle">arXiv研究速递——预印本复杂科学论文每日更新</p>
        
        <div class="arxiv-categories">
          <span class="category-label">分类：</span>
          <div class="category-tags">
            <a-checkable-tag 
              v-for="cat in arxivCategories" 
              :key="cat"
              :checked="selectedArxivCategory === cat"
              @change="selectedArxivCategory = selectedArxivCategory === cat ? '' : cat"
            >
              {{ cat }}
            </a-checkable-tag>
          </div>
        </div>
      </header>

      <!-- Papers list -->
      <div class="papers-list">
        <!-- Loading state -->
        <div v-if="store.loading" class="loading-state">
          <a-spin size="large" />
          <p>加载中...</p>
        </div>
        
        <!-- Papers content - grouped by date (for complexity, ai-science, arxiv) -->
        <template v-else-if="activeTab !== 'user'">
          <div v-for="group in paperGroups" :key="group.dateRange" class="paper-group">
            <h2 class="date-range">{{ group.dateRange }}</h2>
            <PaperItem 
              v-for="paper in group.papers" 
              :key="paper.id" 
              :paper="paper" 
            />
          </div>
          <!-- End of list message -->
          <div v-if="store.papers.length > 0" class="end-message">
            <span>没有更多了</span>
          </div>
        </template>

        <!-- Papers content - flat list (for user tab, no date grouping) -->
        <template v-else>
          <PaperItem 
            v-for="paper in store.papers" 
            :key="paper.id" 
            :paper="paper"
            :hide-abstract-by-default="true"
          />
          <!-- End of list message -->
          <div v-if="store.papers.length > 0" class="end-message">
            <span>没有更多了</span>
          </div>
        </template>
      </div>
    </div>

    <!-- Sidebar -->
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
import { ref, computed, onMounted, watch } from 'vue'
import { LikeOutlined, BookOutlined } from '@ant-design/icons-vue'
import PaperItem from '../components/PaperItem.vue'
import ReadingSidebarCalendar from '../components/ReadingSidebarCalendar.vue'
import ReadingSidebarRanking from '../components/ReadingSidebarRanking.vue'
import ReadingSidebarEncyclopedia from '../components/ReadingSidebarEncyclopedia.vue'
import ReadingSidebarArticles from '../components/ReadingSidebarArticles.vue'
import ReadingSidebarCourses from '../components/ReadingSidebarCourses.vue'
import ReadingSidebarQRCode from '../components/ReadingSidebarQRCode.vue'
import SidebarFooter from '../components/SidebarFooter.vue'
import { usePapersStore } from '../stores/papers'

const store = usePapersStore()

const tabs = [
  { key: 'complexity', label: '复杂速递' },
  { key: 'ai-science', label: 'AI+Science' },
  { key: 'arxiv', label: 'arXiv速递' },
  { key: 'user', label: '用户推荐' },
]

const activeTab = ref('complexity')

// arXiv categories
const arxivCategories = [
  '社会与信息网络',
  '多主体系统',
  '物理与社会',
  '数据分析，统计与概率',
  '元胞自动机与晶格气体',
  '生物物理学',
  '混沌动力学',
  '适应与自组织系统',
  '无序系统与神经网络',
]
const selectedArxivCategory = ref('')

// Watch for tab changes and fetch new data
watch(activeTab, (newTab) => {
  store.fetchPapers(newTab as 'complexity' | 'ai-science' | 'arxiv' | 'user')
})

// Group papers by date range
const paperGroups = computed(() => {
  const groups: { dateRange: string; papers: typeof store.papers }[] = []
  const papersByWeek: Record<string, typeof store.papers> = {}
  
  store.papers.forEach(paper => {
    // Group by week (simplified - just use the date for now)
    const weekKey = paper.date.slice(0, 10)
    if (!papersByWeek[weekKey]) {
      papersByWeek[weekKey] = []
    }
    papersByWeek[weekKey].push(paper)
  })
  
  // Convert to array with date ranges
  Object.keys(papersByWeek).sort().reverse().forEach(key => {
    groups.push({
      dateRange: `${key} ~ ${key}`,
      papers: papersByWeek[key] || []
    })
  })
  
  // If no papers, create a sample group
  if (groups.length === 0) {
    groups.push({
      dateRange: '2025-11-17 ~ 2025-11-23',
      papers: store.papers
    })
  }
  
  return groups
})

onMounted(() => {
  store.fetchPapers(activeTab.value as 'complexity' | 'ai-science' | 'arxiv' | 'user')
})
</script>

<style scoped>
.papers-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Tabs navigation */
.tabs-nav {
  display: flex;
  gap: 0;
  background: #fff;
  padding: 0 20px;
  border-bottom: 1px solid var(--swarma-dividers);
}

.tab-btn {
  padding: 16px 20px;
  background: none;
  border: none;
  font-size: 15px;
  color: var(--swarma-text-secondary);
  cursor: pointer;
  position: relative;
  transition: color 0.2s;
}

.tab-btn:hover {
  color: var(--swarma-primary);
}

.tab-btn.active {
  color: var(--swarma-primary);
  font-weight: 500;
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 0;
  height: 2px;
  background: var(--swarma-primary);
}

/* Page header */
.page-head {
  background: #fff;
  padding: 24px 20px;
}

.page-title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: var(--swarma-text-title);
}

.page-subtitle {
  margin: 0 0 12px;
  font-size: 16px;
  color: var(--swarma-text-primary);
}

.page-description {
  margin: 0 0 16px;
  font-size: 14px;
  color: var(--swarma-text-secondary);
  display: flex;
  align-items: center;
  gap: 6px;
}

/* arXiv categories */
.arxiv-categories {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 16px;
}

.category-label {
  font-size: 14px;
  color: var(--swarma-text-secondary);
  flex-shrink: 0;
  padding-top: 4px;
}

.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.category-tags :deep(.ant-tag-checkable) {
  margin: 0;
  padding: 4px 12px;
  font-size: 13px;
  border-radius: 4px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  color: var(--swarma-text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.category-tags :deep(.ant-tag-checkable:hover) {
  border-color: var(--swarma-primary);
  color: var(--swarma-primary);
}

.category-tags :deep(.ant-tag-checkable-checked) {
  background: var(--swarma-primary);
  border-color: var(--swarma-primary);
  color: #fff;
}

.subscribe-btn {
  height: 40px;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #36d1dc 20%, #5b86e5 100%, #36d1dc 20%) !important;
  border: none !important;
  color: #fff !important;
  box-shadow: 
    0 0 20px rgba(54, 209, 220, 0.6),
    0 0 40px rgba(91, 134, 229, 0.4),
    0 4px 15px rgba(91, 134, 229, 0.3);
  transition: all 0.3s ease;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 
      0 0 20px rgba(54, 209, 220, 0.6),
      0 0 40px rgba(91, 134, 229, 0.4),
      0 4px 15px rgba(91, 134, 229, 0.3);
  }
  to {
    box-shadow: 
      0 0 30px rgba(54, 209, 220, 0.8),
      0 0 60px rgba(91, 134, 229, 0.6),
      0 4px 20px rgba(91, 134, 229, 0.4);
  }
}

.subscribe-btn:hover {
  background: linear-gradient(135deg, #2bc4cf 0%, #4a75d4 100%) !important;
  box-shadow: 
    0 0 35px rgba(54, 209, 220, 0.9),
    0 0 70px rgba(91, 134, 229, 0.7),
    0 6px 25px rgba(91, 134, 229, 0.5);
  transform: translateY(-1px);
  animation: none;
}

.subscribe-hint {
  margin: 0;
  font-size: 14px;
  color: var(--swarma-text-secondary);
  line-height: 1.6;
}

/* Papers list */
.papers-list {
  background: #fff;
}

/* Loading state */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 16px;
}

.loading-state p {
  margin: 0;
  color: var(--swarma-text-secondary);
  font-size: 14px;
}

/* End of list message */
.end-message {
  padding: 30px 20px;
  text-align: center;
  color: var(--swarma-text-secondary);
  font-size: 14px;
}

/* Hide divider on last paper item in last group before end-message */
.paper-group:last-of-type .paper-item:last-of-type {
  border-bottom: none;
}

.paper-group {
  position: relative;
}

/* Sticky date range header */
.date-range {
  margin: 0;
  padding: 16px 20px;
  font-size: 18px;
  font-weight: 500;
  color: var(--swarma-primary);
  background: #fff;
  position: sticky;
  top: 65px; /* Height of the nav header */
  z-index: 5;
}

/* Sidebar */
.sidebar-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-self: flex-start;
}

@media (max-width: 1024px) {
  .papers-layout {
    grid-template-columns: 1fr;
  }
}
</style>

<template>
  <div class="encyclopedia-card">
    <!-- Header with blue left border -->
    <div class="card-header">
      <span class="header-title">集智百科</span>
      <a href="https://wiki.swarma.org" target="_blank" class="more-link">更多</a>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <a-spin size="small" />
    </div>

    <!-- Encyclopedia links list with connecting line -->
    <div v-else class="links-list">
      <a 
        v-for="(item, index) in items" 
        :key="item.title" 
        :href="item.link"
        target="_blank"
        class="link-item"
      >
        <span class="dot-container">
          <span class="blue-dot"></span>
          <!-- Connecting line (hidden for last item) -->
          <span v-if="index < items.length - 1" class="connecting-line"></span>
        </span>
        <span class="link-text">{{ item.title }}</span>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface WikiItem {
  title: string
  link: string
}

const items = ref<WikiItem[]>([])
const loading = ref(true)

// Fetch wikis from API
async function fetchWikis() {
  loading.value = true
  try {
    console.log('Fetching wikis from API...')
    const response = await axios.get('/swarma_api/index/wikis')
    
    const data = response.data
    if (Array.isArray(data) && data.length > 0) {
      items.value = data.slice(0, 12).map((item: any) => ({
        title: item.title,
        link: `https://wiki.swarma.org/index.php/${encodeURIComponent(item.title)}`,
      }))
      console.log(`Loaded ${items.value.length} wiki items from API`)
    } else {
      throw new Error('Empty response')
    }
  } catch (error) {
    console.error('Failed to fetch wikis:', error)
    // Fallback to mock data
    items.value = [
      { title: '大语言模型的涌现', link: '#' },
      { title: '基于有效信息的因果涌现理论', link: '#' },
      { title: '因果涌现', link: '#' },
      { title: '有效信息', link: '#' },
      { title: '基于格兰杰因果量化涌现', link: '#' },
      { title: 'NIS+', link: '#' },
      { title: '计算力学', link: '#' },
      { title: 'NIS', link: '#' },
      { title: 'Effective Information', link: '#' },
      { title: '复杂网络中的因果涌现', link: '#' },
      { title: '奇异值分解（SVD）', link: '#' },
      { title: 'DeepSeek-R1', link: '#' },
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchWikis()
})
</script>

<style scoped>
.encyclopedia-card {
  background: #fff;
  border-radius: 0;
  box-shadow: 0 10px 24px rgba(15, 31, 48, 0.05);
}

/* Header with blue left border */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 16px 12px 12px;
  margin-left: 16px;
  margin-top: 16px;
  position: relative;
}

.card-header::before {
  content: '';
  position: absolute;
  left: 0;
  top: 7px;
  bottom: 7px;
  width: 4px;
  background: var(--swarma-primary);
  border-radius: 0px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--swarma-text-title);
}

.more-link {
  font-size: 13px;
  color: var(--swarma-primary);
  text-decoration: none;
}

.more-link:hover {
  text-decoration: underline;
}

/* Loading state */
.loading-state {
  display: flex;
  justify-content: center;
  padding: 40px 16px;
}

/* Links list */
.links-list {
  display: flex;
  flex-direction: column;
  padding: 8px 0 8px 16px;
}

.link-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 16px 8px 0;
  color: var(--swarma-primary);
  font-size: 14px;
  text-decoration: none;
  transition: background 0.2s;
}

.link-item:hover {
  background: var(--swarma-background);
}

.link-text {
  line-height: 1.5;
}

/* Dot and connecting line container */
.dot-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 8px;
  padding-top: 6px;
}

/* Blue circle (hollow) */
.blue-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: transparent;
  border: 2.5px solid var(--swarma-primary);
  flex-shrink: 0;
  box-sizing: border-box;
}

/* Grey connecting line */
.connecting-line {
  position: absolute;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: calc(100% + 16px);
  background: var(--swarma-dividers);
}
</style>

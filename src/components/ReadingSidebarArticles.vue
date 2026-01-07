<template>
  <div class="articles-card">
    <!-- Header with blue left border -->
    <div class="card-header">
      <span class="header-title">最新公众号推文</span>
      <a href="https://swarma.org" target="_blank" class="more-link">更多</a>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <a-spin size="small" />
    </div>

    <!-- Articles list -->
    <div v-else class="articles-list">
      <a 
        v-for="article in articles" 
        :key="article.id" 
        :href="article.link" 
        target="_blank"
        class="article-item"
      >
        <!-- Article title -->
        <h4 class="article-title">{{ article.title }}</h4>
        
        <!-- Date -->
        <div class="article-date">
          <ClockCircleOutlined class="date-icon" />
          <span>{{ article.date }}</span>
        </div>
        
        <!-- Cover image -->
        <img 
          v-if="article.cover" 
          :src="article.cover" 
          :alt="article.title" 
          class="article-cover" 
        />
        
        <!-- Summary text -->
        <p class="article-summary">{{ article.summary }}</p>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ClockCircleOutlined } from '@ant-design/icons-vue'
import axios from 'axios'

interface Article {
  id: number
  title: string
  date: string
  cover: string
  summary: string
  link: string
}

const articles = ref<Article[]>([])
const loading = ref(true)

// Strip HTML tags
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim()
}

// Fetch featured media image URL
async function fetchMediaUrl(mediaId: number): Promise<string | null> {
  if (!mediaId) return null
  try {
    const response = await axios.get('/swarma_org_proxy/', {
      params: {
        rest_route: `/wp/v2/media/${mediaId}`,
      },
    })
    return response.data?.source_url || null
  } catch (error) {
    console.error(`Failed to fetch media ${mediaId}:`, error)
    return null
  }
}

// Fetch articles from WordPress API
async function fetchArticles() {
  loading.value = true
  try {
    console.log('Fetching articles from WordPress API...')
    const response = await axios.get('/swarma_org_proxy/', {
      params: {
        rest_route: '/wp/v2/posts',
        page: 1,
        per_page: 3,
        _fields: 'id,title,excerpt,link,date,featured_media',
      },
    })
    
    const posts = response.data
    console.log(`Fetched ${posts.length} posts from WordPress`)
    
    // Fetch featured images for each post
    const articlesWithImages: Article[] = []
    for (const post of posts) {
      const coverUrl = await fetchMediaUrl(post.featured_media)
      articlesWithImages.push({
        id: post.id,
        title: stripHtml(post.title?.rendered || 'Untitled'),
        date: post.date?.split('T')[0] || '',
        cover: coverUrl || '',
        summary: stripHtml(post.excerpt?.rendered || '').slice(0, 150) + '...',
        link: post.link || '#',
      })
    }
    
    articles.value = articlesWithImages
    console.log('Articles loaded:', articles.value)
  } catch (error) {
    console.error('Failed to fetch articles:', error)
    // Fallback to mock data
    articles.value = [
      {
        id: 1,
        title: '系统科学：超越相对论与量子力学的科学革命',
        date: '2025-10-01',
        cover: 'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=400',
        summary: '导语 不管哪一门学科，都离不开对系统的研究。系统工程和系统科学在整个21世纪应用的价值及其意义可能会越来越大...',
        link: '#',
      },
      {
        id: 2,
        title: '一盏灯，为你而亮｜集智招全职or兼职运营助理',
        date: '2025-10-01',
        cover: 'https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&w=400',
        summary: '嗨，各位探索者，大家好！我是倩姐。集智学园的联合创始人兼CEO——听起来挺"高大上"是吧？...',
        link: '#',
      },
      {
        id: 3,
        title: 'Nature子刊：非线性动力学最新论文合集',
        date: '2025-09-30',
        cover: 'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=400',
        summary: '导语 非线性动力学从湍流到鸟群，从昆虫爆发到基因调控，非线性动力学为我们揭示了自然与人工系统中最丰富...',
        link: '#',
      },
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchArticles()
})
</script>

<style scoped>
.articles-card {
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

/* Articles list */
.articles-list {
  display: flex;
  flex-direction: column;
}

.article-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid var(--swarma-dividers);
  text-decoration: none;
  transition: background 0.2s;
}

.article-item:last-child {
  border-bottom: none;
}

.article-item:hover {
  background: var(--swarma-background);
}

/* Article title */
.article-title {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: var(--swarma-primary);
  line-height: 1.5;
}

/* Date */
.article-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--swarma-text-secondary);
}

.date-icon {
  font-size: 12px;
}

/* Cover image */
.article-cover {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 4px;
}

/* Summary */
.article-summary {
  margin: 0;
  font-size: 13px;
  color: var(--swarma-text-primary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

